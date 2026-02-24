const { getServiceClient } = require('../_lib/supabase');
module.exports = async function(req, res) {
  var db = getServiceClient(), slug = req.query.slug;
  if (req.method === 'GET') {
    var pin = req.headers['x-pin'] || req.query.pin;
    if (!pin) return res.status(401).json({ error: 'PIN required' });
    var r = await db.from('weddings').select('slug,status,data,updated_at').eq('slug',slug).eq('pin',pin).single();
    if (r.error || !r.data) return res.status(404).json({ error: 'Not found' });
    return res.json(r.data);
  }
  if (req.method === 'PUT') {
    var pin = req.headers['x-pin'];
    if (!pin) return res.status(401).json({ error: 'PIN required' });
    var r = await db.from('weddings').select('id,pin,data').eq('slug',slug).single();
    if (!r.data || r.data.pin !== pin) return res.status(403).json({ error: 'Invalid PIN' });
    var cd = req.body.data || {};
    var block = ['hireType','dhDate','accomPeriod','extraNights','venueDiscountPct','venueDiscountOverride','venueDiscountCustom','cateringDiscountPct','cateringDiscountOverride','cateringDiscountCustom','proposalAdults','proposalKids','proposalBabies','extraNightApproved','venueNotesAdmin','gateCode','venuePayments','cateringPayments','sunsetVerified'];
    var m = Object.assign({}, r.data.data);
    Object.keys(cd).forEach(function(k) { if (block.indexOf(k) === -1) m[k] = cd[k]; });
    var u = await db.from('weddings').update({data:m,last_edited_by:'couple'}).eq('id',r.data.id);
    if (u.error) return res.status(500).json({ error: u.error.message });
    return res.json({ ok: true });
  }
  return res.status(405).json({ error: 'Method not allowed' });
};
