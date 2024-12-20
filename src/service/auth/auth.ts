import { supabase } from "../../supabase_config/supabase";

async function getStudentUser(id: number){
    const response = await supabase.from("").select("").eq("",id);
    return response.data;
}


export const authServices = {getStudentUser};