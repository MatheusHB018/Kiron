// server/whatsappService.js
// Serviço simples para envio de mensagens WhatsApp usando a API Cloud do WhatsApp (Meta)
// Variáveis esperadas em .env:
// WHATSAPP_TOKEN=seu_token_de_acesso
// WHATSAPP_PHONE_ID=phone_number_id (ou WHATSAPP_PHONE_NUMBER_ID)
// Opcional: WHATSAPP_TEMPLATE_DEFAULT=nome_template

const axios = require('axios');
require('dotenv').config();

// Normaliza e aceita aliases de variáveis
function resolveEnv(name, aliases = []) {
  const all = [name, ...aliases];
  for (const key of all) {
    if (process.env[key] && process.env[key].trim() !== '') return process.env[key].trim();
  }
  return '';
}

let WHATSAPP_TOKEN = resolveEnv('WHATSAPP_TOKEN', ['WHATSAPP_CLOUD_TOKEN']);
let WHATSAPP_PHONE_ID = resolveEnv('WHATSAPP_PHONE_ID', ['WHATSAPP_PHONE_NUMBER_ID']);

function hasConfig() {
  return WHATSAPP_TOKEN && WHATSAPP_PHONE_ID;
}

if (!hasConfig()) {
  console.warn('[WhatsappService] Configuração ausente. Defina WHATSAPP_TOKEN e WHATSAPP_PHONE_ID no .env');
}

function reloadConfig() { // caso o processo injete env depois de start
  WHATSAPP_TOKEN = resolveEnv('WHATSAPP_TOKEN', ['WHATSAPP_CLOUD_TOKEN']);
  WHATSAPP_PHONE_ID = resolveEnv('WHATSAPP_PHONE_ID', ['WHATSAPP_PHONE_NUMBER_ID']);
}

/**
 * Envia mensagem de texto simples. (Necessita janela de 24h aberta ou template)
 * @param {string} toNumberRaw - Número do paciente (qualquer formato)
 * @param {string} bodyText - Texto da mensagem
 */
async function sendWhatsappMessage(toNumberRaw, bodyText) {
  reloadConfig();
  if (!hasConfig()) {
    return { ok: false, errorType: 'CONFIG', message: 'Credenciais ausentes: defina WHATSAPP_TOKEN e WHATSAPP_PHONE_ID' };
  }
  // Normalizar número para formato E.164 (Brasil)
  let digits = (toNumberRaw || '').replace(/\D/g, '');
  if (!digits) return { ok: false, errorType: 'NUMBER', message: 'Número inválido' };
  // Se vier com 12 ou 13 dígitos (já com 55) mantém. Se vier 10/11, adiciona 55.
  if ((digits.length === 10 || digits.length === 11) && !digits.startsWith('55')) {
    digits = '55' + digits;
  }
  const to = '+' + digits;

  try {
    const url = `https://graph.facebook.com/v19.0/${WHATSAPP_PHONE_ID}/messages`;
    const payload = {
      messaging_product: 'whatsapp',
      to,
      type: 'text',
      text: { body: bodyText }
    };
    console.log('[WhatsappService] Enviando para', to, 'payload:', payload);
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

module.exports = { sendWhatsappMessage };
