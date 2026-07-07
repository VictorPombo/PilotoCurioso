/**
 * Vercel Project Connector
 * Utilitário para conectar e configurar projetos na Vercel via API.
 * 
 * Uso: Importar as funções e chamar com o token da Vercel.
 * O token pode ser obtido em: https://vercel.com/account/tokens
 */

const VERCEL_API = 'https://api.vercel.com';

interface VercelConfig {
  token: string;
  teamId?: string;
}

interface EnvVar {
  key: string;
  value: string;
  target: ('production' | 'preview' | 'development')[];
  type?: 'sensitive' | 'encrypted' | 'plain';
}

interface CreateProjectOptions {
  name: string;
  framework?: 'nextjs' | 'vite' | 'remix' | 'nuxtjs' | 'gatsby' | null;
  gitRepository?: {
    type: 'github';
    repo: string; // Ex: "VictorPombo/PilotoCurioso"
  };
  buildCommand?: string;
  rootDirectory?: string;
  envVars?: EnvVar[];
}

// ─── Headers helper ───
function headers(token: string) {
  return {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
}

function teamQuery(teamId?: string) {
  return teamId ? `?teamId=${teamId}` : '';
}

// ─── Listar projetos ───
export async function listProjects(config: VercelConfig) {
  const res = await fetch(
    `${VERCEL_API}/v9/projects${teamQuery(config.teamId)}`,
    { headers: headers(config.token) }
  );
  if (!res.ok) throw new Error(`Erro ${res.status}: ${await res.text()}`);
  const data = await res.json();
  return data.projects as { id: string; name: string; framework: string }[];
}

// ─── Buscar projeto por nome ───
export async function getProject(config: VercelConfig, nameOrId: string) {
  const res = await fetch(
    `${VERCEL_API}/v9/projects/${nameOrId}${teamQuery(config.teamId)}`,
    { headers: headers(config.token) }
  );
  if (!res.ok) throw new Error(`Projeto não encontrado: ${nameOrId}`);
  return res.json();
}

// ─── Criar projeto novo ───
export async function createProject(config: VercelConfig, options: CreateProjectOptions) {
  const body: Record<string, unknown> = {
    name: options.name,
    framework: options.framework || 'nextjs',
  };

  if (options.gitRepository) {
    body.gitRepository = options.gitRepository;
  }
  if (options.buildCommand) {
    body.buildCommand = options.buildCommand;
  }
  if (options.rootDirectory) {
    body.rootDirectory = options.rootDirectory;
  }

  const res = await fetch(
    `${VERCEL_API}/v10/projects${teamQuery(config.teamId)}`,
    {
      method: 'POST',
      headers: headers(config.token),
      body: JSON.stringify(body),
    }
  );

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Erro ao criar projeto: ${err}`);
  }

  const project = await res.json();

  // Configurar env vars se fornecidas
  if (options.envVars?.length) {
    await bulkCreateEnvVars(config, project.id, options.envVars);
  }

  return project;
}

// ─── Listar env vars ───
export async function listEnvVars(config: VercelConfig, projectId: string) {
  const res = await fetch(
    `${VERCEL_API}/v9/projects/${projectId}/env${teamQuery(config.teamId)}`,
    { headers: headers(config.token) }
  );
  if (!res.ok) throw new Error(`Erro ao listar envs: ${await res.text()}`);
  const data = await res.json();
  return data.envs as { id: string; key: string; target: string[]; type: string }[];
}

// ─── Criar uma env var ───
export async function createEnvVar(config: VercelConfig, projectId: string, envVar: EnvVar) {
  const res = await fetch(
    `${VERCEL_API}/v10/projects/${projectId}/env${teamQuery(config.teamId)}`,
    {
      method: 'POST',
      headers: headers(config.token),
      body: JSON.stringify({
        key: envVar.key,
        value: envVar.value,
        target: envVar.target,
        type: envVar.type || 'sensitive',
      }),
    }
  );

  if (!res.ok) {
    const err = await res.text();
    // Env já existe? Tentar atualizar
    if (res.status === 409) {
      console.log(`Env ${envVar.key} já existe, atualizando...`);
      return updateEnvVar(config, projectId, envVar);
    }
    throw new Error(`Erro ao criar env ${envVar.key}: ${err}`);
  }

  return res.json();
}

// ─── Criar múltiplas env vars de uma vez ───
export async function bulkCreateEnvVars(config: VercelConfig, projectId: string, envVars: EnvVar[]) {
  const results = [];
  for (const env of envVars) {
    try {
      const result = await createEnvVar(config, projectId, env);
      results.push({ key: env.key, status: 'ok', result });
    } catch (err: any) {
      results.push({ key: env.key, status: 'error', error: err.message });
    }
  }
  return results;
}

// ─── Atualizar env var existente ───
export async function updateEnvVar(config: VercelConfig, projectId: string, envVar: EnvVar) {
  // Primeiro buscar o ID da env existente
  const envs = await listEnvVars(config, projectId);
  const existing = envs.find(e => e.key === envVar.key);

  if (!existing) {
    return createEnvVar(config, projectId, envVar);
  }

  const res = await fetch(
    `${VERCEL_API}/v9/projects/${projectId}/env/${existing.id}${teamQuery(config.teamId)}`,
    {
      method: 'PATCH',
      headers: headers(config.token),
      body: JSON.stringify({
        value: envVar.value,
        target: envVar.target,
        type: envVar.type || 'sensitive',
      }),
    }
  );

  if (!res.ok) throw new Error(`Erro ao atualizar env ${envVar.key}: ${await res.text()}`);
  return res.json();
}

// ─── Adicionar domínio ao projeto ───
export async function addDomain(config: VercelConfig, projectId: string, domain: string) {
  const res = await fetch(
    `${VERCEL_API}/v10/projects/${projectId}/domains${teamQuery(config.teamId)}`,
    {
      method: 'POST',
      headers: headers(config.token),
      body: JSON.stringify({ name: domain }),
    }
  );

  if (!res.ok) throw new Error(`Erro ao adicionar domínio: ${await res.text()}`);
  return res.json();
}

// ─── Trigger redeploy ───
export async function triggerRedeploy(config: VercelConfig, projectId: string) {
  // Buscar o último deploy para pegar o target
  const deploysRes = await fetch(
    `${VERCEL_API}/v6/deployments?projectId=${projectId}&limit=1${config.teamId ? `&teamId=${config.teamId}` : ''}`,
    { headers: headers(config.token) }
  );

  if (!deploysRes.ok) throw new Error('Erro ao buscar deployments');
  const { deployments } = await deploysRes.json();

  if (!deployments?.length) throw new Error('Nenhum deploy encontrado');

  // Usar o mesmo source do último deploy
  const lastDeploy = deployments[0];

  const res = await fetch(
    `${VERCEL_API}/v13/deployments${teamQuery(config.teamId)}`,
    {
      method: 'POST',
      headers: headers(config.token),
      body: JSON.stringify({
        name: lastDeploy.name,
        target: 'production',
        gitSource: lastDeploy.gitSource,
      }),
    }
  );

  if (!res.ok) throw new Error(`Erro no redeploy: ${await res.text()}`);
  return res.json();
}

// ─── Função principal: Conectar projeto completo ───
/**
 * Conecta um projeto à Vercel de ponta a ponta:
 * 1. Cria o projeto (ou busca existente)
 * 2. Configura env vars
 * 3. Adiciona domínio (opcional)
 * 4. Trigger deploy (opcional)
 */
export async function connectProject(
  config: VercelConfig,
  options: CreateProjectOptions & {
    domain?: string;
    deploy?: boolean;
  }
) {
  let project;

  // 1. Tentar buscar projeto existente
  try {
    project = await getProject(config, options.name);
    console.log(`Projeto "${options.name}" encontrado (${project.id})`);
  } catch {
    // 2. Criar novo se não existir
    console.log(`Criando projeto "${options.name}"...`);
    project = await createProject(config, options);
    console.log(`Projeto criado: ${project.id}`);
  }

  // 3. Configurar env vars
  if (options.envVars?.length) {
    console.log(`Configurando ${options.envVars.length} env vars...`);
    const results = await bulkCreateEnvVars(config, project.id, options.envVars);
    const ok = results.filter(r => r.status === 'ok').length;
    const fail = results.filter(r => r.status === 'error').length;
    console.log(`Env vars: ${ok} OK, ${fail} erros`);
  }

  // 4. Adicionar domínio
  if (options.domain) {
    try {
      await addDomain(config, project.id, options.domain);
      console.log(`Domínio "${options.domain}" adicionado`);
    } catch (err: any) {
      console.log(`Domínio: ${err.message}`);
    }
  }

  // 5. Trigger deploy
  if (options.deploy) {
    try {
      const deploy = await triggerRedeploy(config, project.id);
      console.log(`Deploy triggered: ${deploy.url}`);
    } catch (err: any) {
      console.log(`Deploy: ${err.message}`);
    }
  }

  return project;
}

// ─── Exemplo de uso ───
/*
import { connectProject } from '@/utils/vercel-connector';

await connectProject(
  { 
    token: process.env.VERCEL_TOKEN!, 
    teamId: 'team_LXhsztQyZKIbwonLatKNdK4L' // NextHubBR
  },
  {
    name: 'meu-novo-projeto',
    framework: 'nextjs',
    gitRepository: {
      type: 'github',
      repo: 'VictorPombo/MeuProjeto',
    },
    envVars: [
      { key: 'NEXT_PUBLIC_SUPABASE_URL', value: 'https://xxx.supabase.co', target: ['production', 'preview'] },
      { key: 'SUPABASE_SERVICE_ROLE_KEY', value: 'eyJ...', target: ['production'] },
      { key: 'JWT_SECRET', value: 'minha-chave-secreta', target: ['production'] },
    ],
    domain: 'meusite.com.br',
    deploy: true,
  }
);
*/
