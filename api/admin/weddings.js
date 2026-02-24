const { getServiceClient } = require('../_lib/supabase');
function isAdmin(req) { return req.headers['x-admin-token'] === process.env.ADMIN_PASSWORD; }
module.exports = async function(req, res) {
  if (!isAdmin(req)) return res.status(401).json({ error: 'Unauthorized' });
  var db = getServiceClient();
  if (req.method === 'GET') {
    var r = await db.from('weddings').select('id,slug,status,data,must_know,updated_at,last_edited_by,created_at').order('created_at',{ascending:false});
    if (r.error) return res.status(500).json({error:r.error.message});
    return res.json(r.data.map(function(w){var d=w.data||{};var nm={is:'Ibicenco Family',im:'Ibicenco Sharing+Plated',ip:'Ibicenco Plated',sm:'Smoky Zest BBQ',sa:'Saffron Paella'};var vp=(d.venuePayments||[]).reduce(function(s,p){return s+(parseFloat(p.amount)||0);},0);var cp=(d.cateringPayments||[]).reduce(function(s,p){return s+(parseFloat(p.amount)||0);},0);return{id:w.id,slug:w.slug,status:w.status,couple:(d.p1||'?')+' & '+(d.p2||'?'),date:d.dhDate||d.dt||'TBC',menu:nm[d.menu]||'TBC',guests:{adults:d.adults||0,kids:d.kids||0,babies:d.babies||0},hireType:d.hireType||'',venuePaid:vp,cateringPaid:cp,mustKnow:w.must_know||[],updatedAt:w.updated_at,lastEditedBy:w.last_edited_by};}));
  }
  if (req.method === 'POST') {
    var s=req.body.slug,p=req.body.pin,d=req.body.data;
    if(!s||!p)return res.status(400).json({error:'slug and pin required'});
    var ch=await db.from('weddings').select('id').eq('slug',s).single();
    if(ch.data)return res.status(409).json({error:'URL taken'});
    var def={p1:'',p2:'',em:'',ph:'',dt:'',address:'',plannerName:'',plannerEmail:'',passport1:'',weddingID:'',hireType:'accom',dhDate:'',accomPeriod:'',extraNights:0,extraNightRequested:false,extraNightApproved:false,adults:0,kids:0,babies:0,proposalAdults:0,proposalKids:0,proposalBabies:0,menu:'',canapes:[],starters:[],mainS:[],mainF:[],mainV:[],sides:[],dessert:'',paellas:[],salads:[],arr:'',rec:'',bar:'',extraH:0,sunset:false,recExt:false,extRec:false,secondEvent:false,secondEventGuests:40,secondEventFood:'',secondEventDrinks:'',cave:[],extArr:false,noSpeeches:false,sunsetVerified:false,sunsetNotes:'',breakfastOption:'',shoppingStore:'',wantShopping:false,shoppingList:'',brunchWed:false,brunchWedPax:6,brunchAfter:false,brunchAfterPax:8,snacks:false,cake:false,marketTable:false,room1:'',room2:'',room3:'',room4:'',room5:'',bridePeople:'',brideContact1:'',brideContact2:'',brideRoomPrepTime:'',groomLocation:'',groomPeople:'',groomContact1:'',groomContact2:'',morningNeeds:'',uplights:false,festoons:false,discoBalls:false,fairyCurtains:false,sound:false,useRectTable:false,chairSwap:'',roundCloths:0,napkins:false,highChairs:0,cerBenches:0,cerChairType:'',cerChairs:0,tableStyling:false,ceremonyStyle:false,nightPack:false,parkingAtt:false,lateCoord:false,lateCoordExtra:0,caveSecurity:false,caveSecurityExtra:0,gardenStyle:false,gardenSmallPots:0,gardenMedPots:0,gardenXLPots:0,venueNotesAdmin:'',venueDiscountPct:10,venueDiscountOverride:false,venueDiscountCustom:0,cateringDiscountPct:0,cateringDiscountOverride:false,cateringDiscountCustom:0,venuePayments:[],cateringPayments:[],gateCode:'',checkIn:'',checkOut:'',tastingType:'',tastingDate:'',tastingName1:'',tastingName2:'',tastingAllergies:'',confCanapes:[],confStarters:[],confMainS:[],confMainF:[],confMainV:[],confSides:[],confDessert:'',confPaellas:[],confSalads:[],chefNotesCanapes:'',chefNotesStarters:'',chefNotesMain:'',chefNotesDessert:'',catererNotes:'',venueNotes:'',colorTheme:'',styleNotes:'',refundName:'',refundIBAN:'',refundBIC:'',refundBank:'',refundCurrency:''};
    var mg=Object.assign({},def,d||{});
    var r=await db.from('weddings').insert({slug:s,pin:p,data:mg}).select().single();
    if(r.error)return res.status(500).json({error:r.error.message});
    return res.status(201).json(r.data);
  }
  return res.status(405).json({error:'Method not allowed'});
};
