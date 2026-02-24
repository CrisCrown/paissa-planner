const { getServiceClient } = require('../../_lib/supabase');
function isAdmin(req) { return req.headers['x-admin-token'] === process.env.ADMIN_PASSWORD; }
module.exports = async function(req, res) {
  if (!isAdmin(req)) return res.status(401).json({ error: 'Unauthorized' });
  var db = getServiceClient(), slug = req.query.slug;
  if (req.method === 'GET') {
    var r = await db.from('weddings').select('*').eq('slug',slug).single();
    if (r.error||!r.data) return res.status(404).json({error:'Not found'});
    return res.json(r.data);
  }
  if (req.method === 'PUT') {
    var u = {};
    if(req.body.data)u.data=req.body.data;
    if(req.body.pin)u.pin=req.body.pin;
    if(req.body.status)u.status=req.body.status;
    u.last_edited_by='admin';
    var r = await db.from('weddings').update(u).eq('slug',slug);
    if(r.error)return res.status(500).json({error:r.error.message});
    return res.json({ok:true});
  }
  if (req.method === 'DELETE') {
    var r = await db.from('weddings').delete().eq('slug',slug);
    if(r.error)return res.status(500).json({error:r.error.message});
    return res.json({ok:true});
  }
  return res.status(405).json({error:'Method not allowed'});
};
