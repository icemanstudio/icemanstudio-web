// Privacy policy and purchase terms. Holder details: complete `holder` when the business is registered.
export const holder = { name: 'IceMan Studio', person: '', address: 'España', email: 'hola@icemanstudio.com', emailEn: 'hello@icemanstudio.com', updated: '2026-09-15' };

export const legal = {
  en: {
    privacyTitle: 'Privacy policy',
    privacy: [
      ['Who is responsible', `${holder.name}${holder.person ? ` (${holder.person})` : ''}, ${holder.address}. Contact: ${holder.emailEn}.`],
      ['What we collect', 'When you buy: the email, name and country you enter at checkout, the products bought, the amount and date. Payment card data is handled by Stripe and never reaches us. When you create an account: your email, an optional display name and the date. When you write to us: your message and email. Technical logs (IP, browser) are kept by Cloudflare for security for a limited time.'],
      ['Why and on what basis', 'To deliver your purchase and let you download it again (contract). To keep accounting records (legal obligation). To answer your messages (legitimate interest). To send sign-in links you request (contract). We do not send marketing emails unless you ask for them.'],
      ['Who processes it for us', 'Stripe (payments and tax), Cloudflare (hosting, database and file storage in the European Union), Resend (transactional email). Purchases made on itch.io are governed by itch.io\'s own policy.'],
      ['How long', 'Order records: as long as accounting law requires (currently up to 6 years in Spain). Account data: until you delete the account. Sign-in links: 15 minutes. Sessions: 30 days.'],
      ['Cookies', 'Only one technical cookie, ims_session, to keep you signed in. No advertising or tracking cookies. Your browser may store preferences locally (achievements, language), which never leave your device.'],
      ['Your rights', 'Access, rectification, erasure, portability, restriction and objection. You can change your email and delete your account from My account, or write to us. You can also complain to the Spanish Data Protection Agency (aepd.es).'],
      ['Changes', `This policy may be updated; the date at the top shows the current version (${holder.updated}).`]
    ],
    termsTitle: 'Terms of purchase',
    terms: [
      ['What you buy', 'Digital files (software extensions, image packs, 3D models) delivered by download. Prices are in euros; VAT is added at checkout where it applies. Bundles are sold at the fixed price shown.'],
      ['Delivery', 'Right after payment you get a download page and an email with links, valid for 30 days. With a free account (email sign-in) you can download your purchases at any time. Use an email you can access: everything is tied to it.'],
      ['Licence', 'You may use the assets in any project, personal or commercial, and modify them freely. Attribution is welcome but not required. You may not resell or redistribute them as assets, upload them to another asset store, or use them to train AI models. Software extensions are licensed per person; team licences on request.'],
      ['Withdrawal and refunds', 'Under EU consumer law, digital content delivered immediately is exempt from the 14-day withdrawal right once you have agreed to immediate delivery and started the download. If a file is corrupt, missing or not as described, write to us within 14 days and we will fix it or refund you.'],
      ['Updates and support', 'Purchases include updates of the same product. Support by email in English or Spanish; we answer within one business day.'],
      ['Accounts', 'Accounts have no password: access is by email link. You are responsible for the security of that email. You can delete your account at any time.'],
      ['Applicable law', 'Spanish law and, for consumers, the mandatory rules of your country of residence. EU online dispute resolution: ec.europa.eu/consumers/odr.']
    ]
  },
  es: {
    privacyTitle: 'Política de privacidad',
    privacy: [
      ['Responsable', `${holder.name}${holder.person ? ` (${holder.person})` : ''}, ${holder.address}. Contacto: ${holder.email}.`],
      ['Qué datos tratamos', 'Al comprar: el correo, nombre y país que indicas en el pago, los productos comprados, el importe y la fecha. Los datos de la tarjeta los trata Stripe y nunca llegan a nosotros. Al crear una cuenta: tu correo, un nombre opcional y la fecha. Al escribirnos: tu mensaje y tu correo. Cloudflare conserva registros técnicos (IP, navegador) por seguridad durante un tiempo limitado.'],
      ['Para qué y con qué base', 'Para entregarte la compra y que puedas volver a descargarla (contrato). Para llevar la contabilidad (obligación legal). Para responder a tus mensajes (interés legítimo). Para enviarte los enlaces de acceso que solicites (contrato). No enviamos correos comerciales salvo que los pidas.'],
      ['Quién los trata por nosotros', 'Stripe (pagos e impuestos), Cloudflare (alojamiento, base de datos y archivos en la Unión Europea), Resend (correo transaccional). Las compras hechas en itch.io se rigen por la política de itch.io.'],
      ['Cuánto tiempo', 'Registros de pedidos: lo que exija la normativa contable (actualmente hasta 6 años en España). Datos de la cuenta: hasta que la elimines. Enlaces de acceso: 15 minutos. Sesiones: 30 días.'],
      ['Cookies', 'Solo una cookie técnica, ims_session, para mantener tu sesión. Sin cookies de publicidad ni seguimiento. Tu navegador puede guardar preferencias en local (logros, idioma) que nunca salen de tu dispositivo.'],
      ['Tus derechos', 'Acceso, rectificación, supresión, portabilidad, limitación y oposición. Puedes cambiar tu correo y eliminar tu cuenta desde Mi cuenta, o escribirnos. También puedes reclamar ante la Agencia Española de Protección de Datos (aepd.es).'],
      ['Cambios', `Esta política puede actualizarse; la fecha indica la versión vigente (${holder.updated}).`]
    ],
    termsTitle: 'Condiciones de compra',
    terms: [
      ['Qué compras', 'Archivos digitales (extensiones de software, packs de imágenes, modelos 3D) entregados por descarga. Los precios son en euros; el IVA se añade al pagar donde corresponda. Los bundles se venden al precio cerrado indicado.'],
      ['Entrega', 'Justo después del pago recibes una página de descarga y un correo con enlaces válidos 30 días. Con una cuenta gratuita (acceso por correo) puedes descargar tus compras en cualquier momento. Usa un correo al que tengas acceso: todo va ligado a él.'],
      ['Licencia', 'Puedes usar los assets en cualquier proyecto, personal o comercial, y modificarlos libremente. La atribución se agradece pero no es obligatoria. No puedes revenderlos ni redistribuirlos como assets, subirlos a otra tienda ni usarlos para entrenar modelos de IA. Las extensiones se licencian por persona; licencias de equipo bajo consulta.'],
      ['Desistimiento y reembolsos', 'Según la normativa europea de consumo, el contenido digital entregado de inmediato queda excluido del derecho de desistimiento de 14 días una vez aceptas la entrega inmediata e inicias la descarga. Si un archivo está corrupto, falta o no coincide con lo descrito, escríbenos en un plazo de 14 días y lo arreglamos o te devolvemos el dinero.'],
      ['Actualizaciones y soporte', 'Las compras incluyen las actualizaciones del mismo producto. Soporte por correo en español o inglés; respondemos en un día laborable.'],
      ['Cuentas', 'Las cuentas no tienen contraseña: el acceso es por enlace al correo. Eres responsable de la seguridad de ese correo. Puedes eliminar tu cuenta en cualquier momento.'],
      ['Ley aplicable', 'Ley española y, para consumidores, las normas imperativas de tu país de residencia. Resolución de litigios en línea de la UE: ec.europa.eu/consumers/odr.']
    ]
  }
};
