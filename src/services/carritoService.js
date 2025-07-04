import supabase from '../config/supabase.js';
import fetch from 'node-fetch';

const {
    PAYPAL_CLIENT_ID,
    PAYPAL_SECRET,
    NODE_ENV,
} = process.env;

const IS_SANDBOX = NODE_ENV !== 'production';
const PP_BASE = IS_SANDBOX
    ? 'https://api-m.sandbox.paypal.com'
    : 'https://api-m.paypal.com';

async function getPayPalToken() {
    const credentials = Buffer
        .from(`${PAYPAL_CLIENT_ID || 'ATaGCafsIC-VUK4rCOuR7lK80ChEirVkzVwWVWaXrSBLhW7W7NyVcfjzw13_7ITmDJR-1EJtippTWQow'}:${PAYPAL_SECRET || 'ECr3kEUBdeKwkdbfInR9yrpSoreMeLomC_BWhEXc5jhhwrLYvubiJrbSQ2EWab--ECRTFYjLmGkWu2rc'}`)
        .toString('base64');

    const res = await fetch(`https://api-m.sandbox.paypal.com/v1/oauth2/token`, {
        method: 'POST',
        headers: {
            'Authorization': `Basic ${credentials}`,
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: 'grant_type=client_credentials'
    });

    if (!res.ok) {
        const msg = await res.text();
        throw new Error(`PayPal token error: ${msg}`);
    }
    return (await res.json()).access_token;
}

function calcularTotales(items) {
    const item_total = items.reduce((s, i) => s + i.unit * i.qty, 0).toFixed(2);
    const tax_total = (item_total * 0.10).toFixed(2);
    const shipping = (item_total >= 30 ? 0 : 4.99).toFixed(2);
    const grand_total =
        (Number(item_total) + Number(tax_total) + Number(shipping)).toFixed(2);
    return { item_total, tax_total, shipping, grand_total };
}

const checkoutService = {

    async createOrder(userId) {
        const { data: rows, error } = await supabase
            .from('carrito')
            .select('id_producto, producto:producto(id,nombre,precio)')
            .eq('id_usuario', userId);

        if (error) throw new Error('Error leyendo carrito');
        if (!rows.length) throw new Error('Carrito vacío');

        const map = new Map();
        rows.forEach(({ id_producto, producto }) => {
            const obj = map.get(id_producto) ?? {
                id: id_producto,
                name: producto.nombre,
                unit: Number(producto.precio),
                qty: 0,
            };
            obj.qty += 1;
            map.set(id_producto, obj);
        });
        const items = [...map.values()];
        const { item_total, tax_total, shipping, grand_total } =
            calcularTotales(items);

        console.log('Items:', items);
        console.log('Totales:', {
            item_total,
            tax_total,
            shipping,
            grand_total,
        });

        const token = await getPayPalToken();
        const resp = await fetch(`https://api-m.sandbox.paypal.com/v2/checkout/orders/`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                intent: 'CAPTURE',
                application_context: {
                    return_url: 'coffeepalace://paypalpay?opType=payment',
                    cancel_url: 'coffeepalace://paypalpay?opType=cancel',
                },
                purchase_units: [{
                    reference_id: `user-${userId}`,
                    amount: {
                        currency_code: 'USD',
                        value: grand_total,
                        breakdown: {
                            item_total: { currency_code: 'USD', value: item_total },
                            tax_total: { currency_code: 'USD', value: tax_total },
                            shipping: { currency_code: 'USD', value: shipping },
                        },
                    },
                    items: items.map(i => ({
                        name: i.name,
                        quantity: String(i.qty),
                        unit_amount: {
                            currency_code: 'USD',
                            value: i.unit.toFixed(2)
                        },
                    })),
                }],
            }),
        });
        if (!resp.ok) throw new Error(await resp.text());
        const { id: orderId } = await resp.json();

        return orderId;
    },

    async captureOrder(userId, orderId) {
        if (!userId || !orderId) {
            console.error('Faltan parámetros: userId y orderId son obligatorios', { userId, orderId });
            throw new Error('Faltan parámetros: userId y orderId son obligatorios');
        }

        const token = await getPayPalToken();

        if (!token) {
            console.log("no token")
        }

        console.log('Capturando orden PayPal:', orderId);
        console.log('Token PayPal:', token);

        const cap = await fetch(`https://api-m.sandbox.paypal.com/v2/checkout/orders/${orderId}/capture`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
                'PayPal-Request-Id': `${orderId}-${Date.now()}`,
                'Prefer': 'return=representation'
            },
        });

        if (!cap.ok) {
            console.error('Error capturando orden PayPal:', await cap.text());
            throw new Error(await cap.text());
        }
        const paypalCapture = await cap.json();

        console.log('Orden capturada:', paypalCapture);
        const { data: rows } = await supabase
            .from('carrito')
            .select('id_producto, producto:producto(id,nombre,precio)')
            .eq('id_usuario', userId);

        if (!rows.length) {
            console.error('Carrito vacío al capturar orden');
            throw new Error('Carrito no encontrado');
        }

        console.log('Carrito leído:', rows);
        const map = new Map();
        rows.forEach(({ id_producto, producto }) => {
            const o = map.get(id_producto) ?? {
                id: id_producto,
                unit: Number(producto.precio),
                qty: 0,
            };
            o.qty += 1;
            map.set(id_producto, o);
        });
        const items = [...map.values()];
        const { grand_total } = calcularTotales(items);

        const { data: factura, error: facturaError } = await supabase
            .from('factura')
            .insert({
                fecha: new Date().toISOString(),
                usuarioId: userId,
                total_factura: grand_total,
                numero_factura: orderId + "_" + new Date().getTime(),
            })
            .select()
            .single();


        if (facturaError) {
            console.error("Supabase error:", facturaError);
            throw error;
        }

        console.log('Factura insertada:', factura);
        const detalle = items.map(i => ({
            id_factura: factura.id,
            id_producto: i.id,
            cantidad: i.qty,
        }));
        await supabase.from('detalle_factura').insert(detalle);

        await supabase.from('carrito').delete().eq('id_usuario', userId);

        console.log('Factura creada:', {
            facturaId: factura.id,
            numeroFactura: factura.numero_factura,
            paypalCapture: paypalCapture,
        });
        return {
            facturaId: factura.id,
            numeroFactura: factura.numero_factura,
            paypalCapture,
        };
    },
};

export default checkoutService;