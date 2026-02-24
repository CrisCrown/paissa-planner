const { getServiceClient } = require('../_lib/supabase');
module.exports = async function(req, res) {
  var role = null;
  if(req.headers['x-admin-token']===process.env.ADMIN_PASSWORD)role='admin';
  else if(req.headers['x-zest-token']==='zest2026')role='zest';
  if(!role)return res.status(401).json({error:'Unauthorized'});
  var db=getServiceClient(),slug=req.query.slug;
  if(req.method==='POST'){
    var r=await db.from('weddings').select('crm_notes,must_know').eq('slug',slug).single();
    if(!r.data)return res.status(404).json({error:'Not found'});
    var entry={author:role==='admin'?'Cris':'Zest',date:new Date().toISOString().split('T')[0],text:req.body.text};
    var u={};
    if(req.body.type==='must_know')u.must_know=(r.data.must_know||[]).concat([entry]);
    else u.crm_notes=(r.data.crm_notes||[]).concat([entry]);
    await db.from('weddings').update(u).eq('slug',slug);
    return res.json({ok:true});
  }
  return res.status(405).json({error:'Method not allowed'});
};
