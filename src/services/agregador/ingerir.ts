import { createClient } from "@supabase/supabase-js";
import { fontesConfig } from "./fontes-config";
import { buscarRSS } from "./buscar-rss";
import { extrairOG } from "./extrair-og";
import { getServiceClient } from '../../lib/supabase';

export async function ingerir() {
  const supabase = getServiceClient();
  const result: any = {
    sucesso: true,
    portais_processados: 0,
    itens_novos: 0,
    erros: [],
  };

  try {
    // 1. Busca domínios bloqueados
    const { data: dominiosBloq } = await supabase
      .from("dominios_bloqueados")
      .select("dominio");
    
    let bloqueados = dominiosBloq ? dominiosBloq.map(d => d.dominio) : [];

    // 2. Itera sobre cada portal da config
    for (const fonte of fontesConfig) {
      if (bloqueados.some(b => fonte.url.includes(b))) {
        continue;
      }
      
      let itensProcessadosAqui = 0;
      let errosAqui = 0;

      // Extrai os links do feed
      const urlsFonte = await buscarRSS(fonte.url, 20); // limitar a 20 pra evitar gargalo

      for (const link of urlsFonte) {
        // Valida se já existe
        const { data: existente } = await supabase
          .from("noticias_agregadas")
          .select("id")
          .eq("link_original", link)
          .single();

        if (existente) {
          continue; // Já ingerido
        }

        // Delay simples para Rate Limit (1 req / s) recomendado
        await new Promise(r => setTimeout(r, 1000));

        // Extrai o OG daquela URL
        const og = await extrairOG(link);
        if (!og || !og.image || !og.title) {
          errosAqui++;
          continue;
        }

        // Salva
        const { error: insertErr } = await supabase
          .from("noticias_agregadas")
          .insert({
            titulo: og.title,
            og_image_url: og.image,
            link_original: og.url,
            portal_origem: fonte.id,
            categoria: fonte.categoriaDefault,
            og_description: og.description,
            publicado_em: og.published_time ? new Date(og.published_time).toISOString() : new Date().toISOString()
          });

        if (insertErr) {
          console.error("Erro inserindo", og.url, insertErr);
          errosAqui++;
        } else {
          itensProcessadosAqui++;
          result.itens_novos++;
        }
      }

      // Salva em Ingestao Logs o resumo pro portal
      await supabase.from("ingestao_logs").insert({
        portal_origem: fonte.id,
        url_requisitada: fonte.url,
        status_http: 200,
        sucesso: true,
        quantidade_itens_novos: itensProcessadosAqui,
        erro: errosAqui > 0 ? `${errosAqui} erros de extração` : null
      });

      result.portais_processados++;
    }

  } catch (globalErr: any) {
    result.sucesso = false;
    result.erros.push(globalErr.message);
  }

  return result;
}
