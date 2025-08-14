// server/whatsappService.js
const axios = require('axios');
require('dotenv').config();

function resolveEnv(name, aliases = []) {
  const all = [name, ...aliases];
  for (const key of all) {
    if (process.env[key] && process.env[key].trim() !== '') return process.env[key].trim();
  }
  return '';
}

let WHATSAPP_TOKEN = resolveEnv('WHATSAPP_TOKEN');
let WHATSAPP_PHONE_ID = resolveEnv('WHATSAPP_PHONE_ID');

function hasConfig() {
  return WHATSAPP_TOKEN && WHATSAPP_PHONE_ID;
}

if (!hasConfig()) {
  console.warn('[WhatsappService] Configuração ausente.');
}

// O NOME CORRETO DA FUNÇÃO ESTÁ AQUI
async function sendTemplateMessage(toNumberRaw, templateName, options = {}) {
  const { headerImageUrl, params = [], languageCode = 'pt_BR' } = options;

  WHATSAPP_TOKEN = resolveEnv('WHATSAPP_TOKEN');
  WHATSAPP_PHONE_ID = resolveEnv('WHATSAPP_PHONE_ID');
  
  if (!hasConfig()) {
    return { ok: false, errorType: 'CONFIG', message: 'Credenciais ausentes' };
  }

  let digits = (toNumberRaw || '').replace(/\D/g, '');
  if (!digits) return { ok: false, errorType: 'NUMBER', message: 'Número inválido' };
  if ((digits.length === 10 || digits.length === 11) && !digits.startsWith('55')) {
    digits = '55' + digits;
  }
  const to = '+' + digits;

  const components = [];

  if (headerImageUrl) {
    components.push({
      type: 'header',
      parameters: [{
        type: 'image',
        image: { link: headerImageUrl }
      }]
    });
  }

  if (params.length > 0) {
    components.push({
      type: 'body',
      parameters: params.map(p => ({ type: 'text', text: p.toString() }))
    });
  }

  try {
    const url = `https://graph.facebook.com/v20.0/${WHATSAPP_PHONE_ID}/messages`;
    const payload = {
      messaging_product: 'whatsapp',
      to,
      type: 'template',
      template: {
        name: templateName,
        language: { code: languageCode },
        components: components
      }
    };

    console.log('[WhatsappService] Enviando template:', templateName, 'para:', to);
    const res = await axios.post(url, payload, {
      headers: {
        Authorization: `Bearer ${WHATSAPP_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });
    console.log('[WhatsappService] Resposta API:', res.data);
    return { ok: true, responseId: res.data.messages?.[0]?.id, raw: res.data };
  } catch (error) {
    const apiErr = error.response?.data || error.message;
    console.error('[WhatsappService] Erro ao enviar mensagem:', apiErr);
    return { ok: false, errorType: 'API', error: apiErr };
  }
}

// A EXPORTAÇÃO CORRETA ESTÁ AQUI
module.exports = { sendTemplateMessage };