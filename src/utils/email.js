// Función que envía un email usando EmailJS
// Requiere configurar .env con VITE_EMAILJS_*

import emailjs from "@emailjs/browser";

/**
 * sendResultsEmail
 * @param {Object} payload - { summaryText: string, answersObj: Object }
 * @returns Promise
 */
export function sendResultsEmail({ summaryText, answersObj }) {
  const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
  const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
  const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

  // Template params que coincidan con tu template en EmailJS
  const templateParams = {
    subject: "Nuevo resultado G2KY — Get To Know You",
    message: summaryText,
    // Pasamos además el JSON para que lo tengas completo en el email si quieres:
    answers_json: JSON.stringify(answersObj, null, 2),
    receiver_email: import.meta.env.VITE_RESULT_RECEIVER_EMAIL || "",
  };

  // La función retorna la promesa (para manejar errores desde el componente)
  return emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams, PUBLIC_KEY);
}
