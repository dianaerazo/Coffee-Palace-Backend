// services/commentsService.js
const supabase = require("../config/config");

async function getComments() {
  const { data, error } = await supabase.from("comments").select("*");
  if (error) throw error;
  return data;
}

module.exports = { getComments };
