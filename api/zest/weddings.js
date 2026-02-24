const { getServiceClient } = require('../_lib/supabase');
module.exports = async function(req, res) {
  if (req.headers['x-zest-token'] !== 'zest2026') return res.status(401).json({error:'Unauthorized'});
  var db = getServiceClient();
  var r = await db.from('weddings').select('slug,data,updated_at').eq('status','active');
  if(r.error)return res.status(500).json({error:r.error.message});
  return res.json(r.data.map(function(w){var d=w.data||{};return{slug:w.slug,couple:(d.p1||'?')+' & '+(d.p2||'?'),date:d.dt||'TBC',menu:d.menu||''};}));
};
