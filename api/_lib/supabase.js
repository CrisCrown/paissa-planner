const { createClient } = require('@supabase/supabase-js');
function getServiceClient() {
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);
}
module.exports = { getServiceClient };
