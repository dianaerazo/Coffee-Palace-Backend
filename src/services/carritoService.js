// your-backend-project/src/services/carritoService.js
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

    
/* ---------- util PayPal ---------- */
async function getPayPalToken() {
    const credentials = Buffer
        .from(`${PAYPAL_CLIENT_ID}:${PAYPAL_SECRET}`)
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


/* ---------- helper totales ---------- */
function calcularTotales(items) {
    const item_total = items.reduce((s, i) => s + i.unit * i.qty, 0).toFixed(2);
    const tax_total = (item_total * 0.10).toFixed(2);
    const shipping = (item_total >= 30 ? 0 : 4.99).toFixed(2);
    const grand_total =
        (Number(item_total) + Number(tax_total) + Number(shipping)).toFixed(2);
    return { item_total, tax_total, shipping, grand_total };
}

const carritoService = {
    /**
     * Añade una unidad de un producto al carrito de un usuario.
     * Esto inserta una nueva fila en la tabla 'carrito'.
     * @param {number} id_producto - ID del producto.
     * @param {string} auth_id_usuario - ID de autenticación del usuario (UUID de Firebase/Supabase).
     * @returns {Promise<Object>} El objeto 'carrito' insertado.
     */
    addCartItem: async (id_producto, auth_id_usuario) => { 
        try {
            // 1. Buscar el ID numérico interno del usuario basado en el auth_id_usuario (UUID)
            const { data: userData, error: userError } = await supabase
                .from('usuario') // Confirmado que la tabla se llama 'usuario' (singular)
                .select('id') 
                .eq('auth_id', auth_id_usuario) // CAMBIO AQUÍ: Usar 'auth_id' según tu tabla
                .single(); 

            if (userError || !userData) {
                console.error('Error finding user by auth_id:', userError);
                throw new Error(`Usuario no encontrado con auth ID: ${auth_id_usuario}`);
            }

            const internal_user_id = userData.id; 

            // 2. Ahora usa el ID numérico para insertar en la tabla 'carrito'
            const { data, error } = await supabase
                .from('carrito')
                .insert([{ id_producto, id_usuario: internal_user_id }]) 
                .select(); 

            if (error) {
                console.error('Error adding cart item:', error);
                throw new Error(`Failed to add item to cart: ${error.message}`);
            }
            return data[0]; 
        } catch (e) {
            console.error('Exception in addCartItem service:', e);
            throw e;
        }
    },

    /**
     * Obtiene todos los ítems brutos (sin agregar) del carrito de un usuario.
     * @param {string} auth_id_usuario - ID de autenticación del usuario (UUID).
     * @returns {Promise<Array>} Lista de objetos 'carrito'.
     */
    getRawCartItemsForUser: async (auth_id_usuario) => { 
        try {
            // 1. Buscar el ID numérico interno del usuario basado en el auth_id_usuario (UUID)
            const { data: userData, error: userError } = await supabase
                .from('usuario') // Confirmado que la tabla se llama 'usuario' (singular)
                .select('id')
                .eq('auth_id', auth_id_usuario) // CAMBIO AQUÍ: Usar 'auth_id' según tu tabla
                .single();

            if (userError || !userData) {
                console.error('Error finding user by auth_id:', userError);
                throw new Error(`Usuario no encontrado con auth ID: ${auth_id_usuario}`);
            }

            const internal_user_id = userData.id; 

            // 2. Obtener los ítems del carrito usando el ID numérico interno
            const { data, error } = await supabase
                .from('carrito')
                .select('*')
                .eq('id_usuario', internal_user_id); 

            if (error) {
                console.error('Error getting raw cart items:', error);
                throw new Error(`Failed to get raw cart items: ${error.message}`);
            }
            return data;
        } catch (e) {
            console.error('Exception in getRawCartItemsForUser service:', e);
            throw e;
        }
    },

    /**
     * Elimina una entrada específica del carrito (una unidad de producto).
     * @param {number} cartItemId - El ID de la entrada específica en la tabla 'carrito'.
     * @returns {Promise<Object>} Objeto con mensaje de éxito o error.
     */
    deleteCartEntry: async (cartItemId) => {
        try {
            const { error } = await supabase
                .from('carrito')
                .delete()
                .eq('id', cartItemId);

            if (error) {
                console.error('Error deleting cart entry:', error);
                throw new Error(`Failed to delete cart entry: ${error.message}`);
            }
            return { message: 'Cart entry deleted successfully.' };
        } catch (e) {
            console.error('Exception in deleteCartEntry service:', e);
            throw e;
        }
    },

    /**
     * Vacía todo el carrito de un usuario.
     * @param {string} auth_id_usuario - ID de autenticación del usuario (UUID).
     * @returns {Promise<Object>} Objeto con mensaje de éxito o error.
     */
    clearUserCart: async (auth_id_usuario) => { 
        try {
            // 1. Buscar el ID numérico interno del usuario basado en el auth_id_usuario (UUID)
            const { data: userData, error: userError } = await supabase
                .from('usuario') // Confirmado que la tabla se llama 'usuario' (singular)
                .select('id')
                .eq('auth_id', auth_id_usuario) // CAMBIO AQUÍ: Usar 'auth_id' según tu tabla
                .single();

            if (userError || !userData) {
                console.error('Error finding user by auth_id:', userError);
                throw new Error(`Usuario no encontrado para borrar carrito con auth ID: ${auth_id_usuario}`);
            }

            const internal_user_id = userData.id; 

            // 2. Eliminar los ítems del carrito usando el ID numérico interno
            const { error } = await supabase
                .from('carrito')
                .delete()
                .eq('id_usuario', internal_user_id); 

            if (error) {
                console.error('Error clearing user cart:', error);
                throw new Error(`Failed to clear user cart: ${error.message}`);
            }
            return { message: 'User cart cleared successfully.' };
        } catch (e) {
            console.error('Exception in clearUserCart service:', e);
            throw e;
        }
    },

    /* Paso 1 · Sólo crea la orden y devuelve orderId */
    async createOrder(userId) {
        /* 1.1 Agrupar carrito */
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

        /* 1.2 Crear orden en PayPal */
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

    /* Paso 2 · Captura, factura y limpia carrito */
    async captureOrder(userId, orderId) {
        if (!userId || !orderId) {
            console.error('Faltan parámetros: userId y orderId son obligatorios', { userId, orderId });
            throw new Error('Faltan parámetros: userId y orderId son obligatorios');
        }

        /* 2.1 Capturar en PayPal */
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
        /* 2.2 Releer carrito para detalle */
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

        /* 2.4 Insertar factura */
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
        /* 2.5 Insertar detalle_factura */
        const detalle = items.map(i => ({
            id_factura: factura.id,
            id_producto: i.id,
            cantidad: i.qty,
        }));
        await supabase.from('detalle_factura').insert(detalle);

        /* 2.6 Vaciar carrito */
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

export default carritoService;
