// Translations for the public landing page (PublicLanding.tsx), keyed by the
// exact English source string. English and Arabic already live inline in
// the component as `isAr ? arText : enText`; this dictionary supplies the
// other five languages via the L(en, ar) helper, which falls back to the
// English string itself if a key is missing (safe default, never breaks).
export type NewLang = 'fr' | 'de' | 'es' | 'pt' | 'it';

export const LANDING_TRANSLATIONS: Record<string, Record<NewLang, string>> = {
  '100% digital & fast-track approved solutions': {
    fr: 'Solutions 100 % numériques et à traitement accéléré',
    de: '100 % digitale Lösungen mit beschleunigter Bearbeitung',
    es: 'Soluciones 100% digitales y de tramitación acelerada',
    pt: 'Soluções 100% digitais com processamento acelerado',
    it: 'Soluzioni 100% digitali con approvazione rapida'
  },
  'Authorized ISO Provider': {
    fr: 'Prestataire ISO agréé',
    de: 'Autorisierter ISO-Anbieter',
    es: 'Proveedor ISO autorizado',
    pt: 'Fornecedor ISO autorizado',
    it: 'Fornitore ISO autorizzato'
  },
  'Global ISO certification platform': {
    fr: 'Plateforme mondiale de certification ISO',
    de: 'Globale Plattform für ISO-Zertifizierung',
    es: 'Plataforma global de certificación ISO',
    pt: 'Plataforma global de certificação ISO',
    it: 'Piattaforma globale di certificazione ISO'
  },
  'Home': { fr: 'Accueil', de: 'Startseite', es: 'Inicio', pt: 'Início', it: 'Home' },
  'About': { fr: 'À propos', de: 'Über uns', es: 'Acerca de', pt: 'Sobre', it: 'Chi siamo' },
  'Why Us?': { fr: 'Pourquoi nous ?', de: 'Warum wir?', es: '¿Por qué nosotros?', pt: 'Por que nós?', it: 'Perché noi?' },
  'How It Works': { fr: 'Comment ça marche', de: 'So funktioniert es', es: 'Cómo funciona', pt: 'Como funciona', it: 'Come funziona' },
  'Certificates': { fr: 'Certificats', de: 'Zertifikate', es: 'Certificados', pt: 'Certificados', it: 'Certificati' },
  'FAQs': { fr: 'FAQ', de: 'Häufige Fragen', es: 'Preguntas frecuentes', pt: 'Perguntas frequentes', it: 'Domande frequenti' },
  'Contact': { fr: 'Contact', de: 'Kontakt', es: 'Contacto', pt: 'Contato', it: 'Contatti' },
  'Certificates & Pricing': {
    fr: 'Certificats et tarifs',
    de: 'Zertifikate & Preise',
    es: 'Certificados y precios',
    pt: 'Certificados e preços',
    it: 'Certificati e prezzi'
  },
  'Go to Client Area': { fr: 'Accéder à mon espace client', de: 'Zum Kundenbereich', es: 'Ir al área de cliente', pt: 'Ir para a área do cliente', it: 'Vai all’area cliente' },
  'Client Portal': { fr: 'Portail client', de: 'Kundenportal', es: 'Portal del cliente', pt: 'Portal do cliente', it: 'Portale cliente' },
  'Sign in to Portal': { fr: 'Se connecter au portail', de: 'Beim Portal anmelden', es: 'Iniciar sesión en el portal', pt: 'Entrar no portal', it: 'Accedi al portale' },
  'ISO Certification Made Simple': {
    fr: 'La certification ISO en toute simplicité',
    de: 'ISO-Zertifizierung leicht gemacht',
    es: 'La certificación ISO, simplificada',
    pt: 'Certificação ISO simplificada',
    it: 'La certificazione ISO diventa semplice'
  },
  'The fastest and most affordable way to become internationally ISO Certified.': {
    fr: 'Le moyen le plus rapide et le plus abordable d’obtenir une certification ISO reconnue à l’international.',
    de: 'Der schnellste und günstigste Weg zu einer international anerkannten ISO-Zertifizierung.',
    es: 'La forma más rápida y asequible de obtener una certificación ISO reconocida internacionalmente.',
    pt: 'A forma mais rápida e acessível de obter a certificação ISO reconhecida internacionalmente.',
    it: 'Il modo più rapido ed economico per ottenere una certificazione ISO riconosciuta a livello internazionale.'
  },
  'ISO Order Portal is the premier digital ISO platform dedicated to supporting your certification, offering localized workflow, automated document preparation, and swift access to globally recognized accreditation.': {
    fr: 'ISO Order Portal est la première plateforme numérique dédiée à votre certification ISO, avec un processus adapté localement, une préparation automatisée des documents et un accès rapide à une accréditation reconnue mondialement.',
    de: 'ISO Order Portal ist die führende digitale ISO-Plattform, die Ihre Zertifizierung unterstützt – mit lokalisierten Abläufen, automatisierter Dokumentenerstellung und schnellem Zugang zu weltweit anerkannter Akkreditierung.',
    es: 'ISO Order Portal es la principal plataforma digital de ISO dedicada a apoyar tu certificación, con un flujo de trabajo localizado, preparación automática de documentos y acceso rápido a una acreditación reconocida mundialmente.',
    pt: 'A ISO Order Portal é a principal plataforma digital de ISO dedicada a apoiar a sua certificação, com fluxo de trabalho localizado, preparação automática de documentos e acesso rápido a uma acreditação reconhecida mundialmente.',
    it: 'ISO Order Portal è la principale piattaforma digitale ISO dedicata a supportare la tua certificazione, con un flusso di lavoro localizzato, preparazione automatica dei documenti e accesso rapido a un accreditamento riconosciuto a livello globale.'
  },
  'Contact Us': { fr: 'Contactez-nous', de: 'Kontaktieren Sie uns', es: 'Contáctenos', pt: 'Fale connosco', it: 'Contattaci' },
  'Explore Packages': { fr: 'Découvrir les forfaits', de: 'Pakete entdecken', es: 'Explorar paquetes', pt: 'Explorar pacotes', it: 'Esplora i pacchetti' },
  'Chat With An ISO Advisor': { fr: 'Discutez avec un conseiller ISO', de: 'Mit einem ISO-Berater chatten', es: 'Chatea con un asesor ISO', pt: 'Fale com um consultor ISO', it: 'Chatta con un consulente ISO' },
  'ACCREDITED': { fr: 'ACCRÉDITÉ', de: 'AKKREDITIERT', es: 'ACREDITADO', pt: 'ACREDITADO', it: 'ACCREDITATO' },
  'Digital Registry details': { fr: 'Détails du registre numérique', de: 'Details der digitalen Registrierung', es: 'Detalles del registro digital', pt: 'Detalhes do registo digital', it: 'Dettagli del registro digitale' },
  'Smart Digital Certification for Enterprises': {
    fr: 'Certification numérique intelligente pour les entreprises',
    de: 'Intelligente digitale Zertifizierung für Unternehmen',
    es: 'Certificación digital inteligente para empresas',
    pt: 'Certificação digital inteligente para empresas',
    it: 'Certificazione digitale intelligente per le aziende'
  },
  'Processing speed': { fr: 'Vitesse de traitement', de: 'Bearbeitungsgeschwindigkeit', es: 'Velocidad de tramitación', pt: 'Velocidade de processamento', it: 'Velocità di elaborazione' },
  'Express (3-7 Days)': { fr: 'Express (3 à 7 jours)', de: 'Express (3–7 Tage)', es: 'Exprés (3-7 días)', pt: 'Expresso (3-7 dias)', it: 'Espresso (3-7 giorni)' },
  'Avg. cost reduction': { fr: 'Réduction moyenne des coûts', de: 'Durchschnittliche Kostensenkung', es: 'Reducción media de costes', pt: 'Redução média de custos', it: 'Riduzione media dei costi' },
  'Start Fast-Track Process': { fr: 'Démarrer la procédure accélérée', de: 'Schnellverfahren starten', es: 'Iniciar proceso acelerado', pt: 'Iniciar processo acelerado', it: 'Avvia la procedura accelerata' },
  'Every Certificate Is Genuine & IAF Accredited': {
    fr: 'Chaque certificat est authentique et accrédité IAF',
    de: 'Jedes Zertifikat ist echt und IAF-akkreditiert',
    es: 'Cada certificado es auténtico y está acreditado por la IAF',
    pt: 'Cada certificado é genuíno e acreditado pela IAF',
    it: 'Ogni certificato è autentico e accreditato IAF'
  },
  'ISO Order Portal issues certificates exclusively through accreditation bodies that are members of the International Accreditation Forum (IAF), and every certificate is instantly verifiable through the official IAF CertSearch global registry.': {
    fr: 'ISO Order Portal délivre ses certificats exclusivement via des organismes d’accréditation membres du Forum International d’Accréditation (IAF), et chaque certificat est instantanément vérifiable via le registre mondial officiel IAF CertSearch.',
    de: 'ISO Order Portal stellt Zertifikate ausschließlich über Akkreditierungsstellen aus, die Mitglieder des International Accreditation Forum (IAF) sind. Jedes Zertifikat ist sofort über das offizielle globale Register IAF CertSearch überprüfbar.',
    es: 'ISO Order Portal emite certificados exclusivamente a través de organismos de acreditación que son miembros del Foro Internacional de Acreditación (IAF), y cada certificado puede verificarse al instante en el registro oficial global IAF CertSearch.',
    pt: 'A ISO Order Portal emite certificados exclusivamente através de organismos de acreditação membros do Fórum Internacional de Acreditação (IAF), e cada certificado pode ser verificado instantaneamente no registo oficial global IAF CertSearch.',
    it: 'ISO Order Portal rilascia certificati esclusivamente tramite enti di accreditamento membri dell’International Accreditation Forum (IAF), e ogni certificato è verificabile all’istante nel registro globale ufficiale IAF CertSearch.'
  },
  'Auditor Network': { fr: 'Réseau d’auditeurs', de: 'Auditoren-Netzwerk', es: 'Red de auditores', pt: 'Rede de auditores', it: 'Rete di auditor' },
  'IRCA Approved': { fr: 'Approuvé IRCA', de: 'IRCA-zugelassen', es: 'Aprobado por IRCA', pt: 'Aprovado pela IRCA', it: 'Approvato IRCA' },
  'Lab Compliance': { fr: 'Conformité de laboratoire', de: 'Laborkonformität', es: 'Cumplimiento de laboratorio', pt: 'Conformidade laboratorial', it: 'Conformità di laboratorio' },
  'Highest Standards': { fr: 'Normes les plus strictes', de: 'Höchste Standards', es: 'Los más altos estándares', pt: 'Padrões mais elevados', it: 'Standard più elevati' },
  'A cloud-based ISO Documentation system that can be used remotely, to eliminate high cost of ISO Certification.': {
    fr: 'Un système de documentation ISO basé sur le cloud, utilisable à distance, pour éliminer les coûts élevés de la certification ISO.',
    de: 'Ein cloudbasiertes ISO-Dokumentationssystem, das aus der Ferne genutzt werden kann, um die hohen Kosten einer ISO-Zertifizierung zu vermeiden.',
    es: 'Un sistema de documentación ISO basado en la nube que se puede usar de forma remota, para eliminar el alto coste de la certificación ISO.',
    pt: 'Um sistema de documentação ISO baseado na nuvem que pode ser utilizado remotamente, eliminando o elevado custo da certificação ISO.',
    it: 'Un sistema di documentazione ISO basato sul cloud, utilizzabile da remoto, per eliminare gli alti costi della certificazione ISO.'
  },
  'Our unique cloud solution accelerates the certification process, making us the quickest and most affordable provider of accredited ISO certificates. ISO Order Portal ensures absolute clarity, regulatory relevance, and seamless digital execution.': {
    fr: 'Notre solution cloud unique accélère le processus de certification, faisant de nous le fournisseur le plus rapide et le plus abordable de certificats ISO accrédités. ISO Order Portal garantit une clarté absolue, une pertinence réglementaire et une exécution numérique fluide.',
    de: 'Unsere einzigartige Cloud-Lösung beschleunigt den Zertifizierungsprozess und macht uns zum schnellsten und günstigsten Anbieter akkreditierter ISO-Zertifikate. ISO Order Portal garantiert absolute Klarheit, regulatorische Relevanz und nahtlose digitale Umsetzung.',
    es: 'Nuestra exclusiva solución en la nube acelera el proceso de certificación, convirtiéndonos en el proveedor más rápido y asequible de certificados ISO acreditados. ISO Order Portal garantiza total claridad, relevancia normativa y una ejecución digital fluida.',
    pt: 'A nossa solução exclusiva na nuvem acelera o processo de certificação, tornando-nos o fornecedor mais rápido e acessível de certificados ISO acreditados. A ISO Order Portal garante total clareza, relevância regulatória e execução digital sem falhas.',
    it: 'La nostra esclusiva soluzione cloud accelera il processo di certificazione, rendendoci il fornitore più rapido e conveniente di certificati ISO accreditati. ISO Order Portal garantisce chiarezza assoluta, rilevanza normativa ed esecuzione digitale senza intoppi.'
  },
  'See Pricing': { fr: 'Voir les tarifs', de: 'Preise ansehen', es: 'Ver precios', pt: 'Ver preços', it: 'Vedi i prezzi' },
  'Satisfied Members': { fr: 'Membres satisfaits', de: 'Zufriedene Mitglieder', es: 'Miembros satisfechos', pt: 'Membros satisfeitos', it: 'Membri soddisfatti' },
  'Training Certificates Issued': { fr: 'Certificats de formation délivrés', de: 'Ausgestellte Schulungszertifikate', es: 'Certificados de formación emitidos', pt: 'Certificados de formação emitidos', it: 'Certificati di formazione rilasciati' },
  'Countries Supported': { fr: 'Pays desservis', de: 'Unterstützte Länder', es: 'Países atendidos', pt: 'Países atendidos', it: 'Paesi serviti' },
  'Years of Experience': { fr: 'Années d’expérience', de: 'Jahre Erfahrung', es: 'Años de experiencia', pt: 'Anos de experiência', it: 'Anni di esperienza' },
  'Exclusive Member Benefits': { fr: 'Avantages exclusifs pour les membres', de: 'Exklusive Mitgliedervorteile', es: 'Ventajas exclusivas para miembros', pt: 'Benefícios exclusivos para membros', it: 'Vantaggi esclusivi per i membri' },
  'Empowering your organization with the absolute best compliance assets and continuous assistance.': {
    fr: 'Nous donnons à votre organisation les meilleures ressources de conformité et une assistance continue.',
    de: 'Wir stärken Ihr Unternehmen mit erstklassigen Compliance-Ressourcen und kontinuierlicher Unterstützung.',
    es: 'Potenciamos a tu organización con los mejores recursos de cumplimiento y asistencia continua.',
    pt: 'Capacitamos a sua organização com os melhores recursos de conformidade e assistência contínua.',
    it: 'Diamo alla tua organizzazione le migliori risorse di conformità e un’assistenza continua.'
  },
  'Credibility': { fr: 'Crédibilité', de: 'Glaubwürdigkeit', es: 'Credibilidad', pt: 'Credibilidade', it: 'Credibilità' },
  'Global compliance verified': { fr: 'Conformité mondiale vérifiée', de: 'Globale Compliance geprüft', es: 'Cumplimiento global verificado', pt: 'Conformidade global verificada', it: 'Conformità globale verificata' },
  'Downloadable Tools': { fr: 'Outils téléchargeables', de: 'Herunterladbare Tools', es: 'Herramientas descargables', pt: 'Ferramentas para download', it: 'Strumenti scaricabili' },
  'We provide printable hazard posters and ready-to-use compliance templates with optimal placement guides.': {
    fr: 'Nous fournissons des affiches de danger imprimables et des modèles de conformité prêts à l’emploi, avec des guides d’affichage optimal.',
    de: 'Wir stellen druckbare Gefahrenplakate und einsatzbereite Compliance-Vorlagen mit optimalen Platzierungshinweisen bereit.',
    es: 'Ofrecemos carteles de peligro imprimibles y plantillas de cumplimiento listas para usar, con guías de colocación óptima.',
    pt: 'Fornecemos cartazes de perigo imprimíveis e modelos de conformidade prontos a usar, com guias de colocação ideal.',
    it: 'Forniamo cartelli di pericolo stampabili e modelli di conformità pronti all’uso, con guide per il posizionamento ottimale.'
  },
  '36 Months Validity': { fr: 'Validité de 36 mois', de: '36 Monate Gültigkeit', es: 'Validez de 36 meses', pt: 'Validade de 36 meses', it: 'Validità di 36 mesi' },
  'Our issued ISO certificates and active portal memberships remain valid for a full 36 months of secure compliance.': {
    fr: 'Nos certificats ISO délivrés et les adhésions actives au portail restent valables pendant 36 mois complets de conformité sécurisée.',
    de: 'Unsere ausgestellten ISO-Zertifikate und aktiven Portalmitgliedschaften bleiben volle 36 Monate lang gültig – bei durchgehender Compliance-Sicherheit.',
    es: 'Nuestros certificados ISO emitidos y las membresías activas del portal permanecen válidos durante 36 meses completos de cumplimiento seguro.',
    pt: 'Os nossos certificados ISO emitidos e as adesões ativas ao portal permanecem válidos durante 36 meses completos de conformidade segura.',
    it: 'I nostri certificati ISO rilasciati e gli abbonamenti attivi al portale rimangono validi per 36 mesi completi di conformità sicura.'
  },
  'Training Courses': { fr: 'Formations', de: 'Schulungen', es: 'Cursos de formación', pt: 'Cursos de formação', it: 'Corsi di formazione' },
  'Members receive complimentary access to qualified internal auditor training courses to empower in-house teams.': {
    fr: 'Les membres bénéficient d’un accès gratuit à des formations qualifiantes d’auditeur interne pour renforcer leurs équipes.',
    de: 'Mitglieder erhalten kostenlosen Zugang zu qualifizierten Schulungen für interne Auditoren, um interne Teams zu stärken.',
    es: 'Los miembros reciben acceso gratuito a cursos de formación de auditor interno cualificados para fortalecer a sus equipos.',
    pt: 'Os membros recebem acesso gratuito a cursos de formação de auditor interno qualificados para capacitar as suas equipas.',
    it: 'I membri ricevono accesso gratuito a corsi di formazione qualificati per auditor interni, per potenziare i team aziendali.'
  },
  'Online Support Desk': { fr: 'Assistance en ligne', de: 'Online-Support', es: 'Soporte en línea', pt: 'Suporte online', it: 'Assistenza online' },
  'Your dedicated hub for auditor-led guidance, fast answers, and continuous assistance throughout the year.': {
    fr: 'Votre plateforme dédiée pour des conseils d’auditeurs, des réponses rapides et une assistance continue toute l’année.',
    de: 'Ihre zentrale Anlaufstelle für auditorgeführte Beratung, schnelle Antworten und ganzjährige Unterstützung.',
    es: 'Tu centro dedicado para orientación de auditores, respuestas rápidas y asistencia continua durante todo el año.',
    pt: 'O seu centro dedicado para orientação de auditores, respostas rápidas e assistência contínua durante todo o ano.',
    it: 'Il tuo punto di riferimento dedicato per la guida degli auditor, risposte rapide e assistenza continua tutto l’anno.'
  },
  'Satisfied Members & Verified Partners': { fr: 'Membres satisfaits et partenaires vérifiés', de: 'Zufriedene Mitglieder & verifizierte Partner', es: 'Miembros satisfechos y socios verificados', pt: 'Membros satisfeitos e parceiros verificados', it: 'Membri soddisfatti e partner verificati' },
  'Client Logo': { fr: 'Logo du client', de: 'Kundenlogo', es: 'Logo del cliente', pt: 'Logótipo do cliente', it: 'Logo del cliente' },
  'Reasons To Choose ISO Order Portal For Your ISO Certificates': {
    fr: 'Pourquoi choisir ISO Order Portal pour vos certificats ISO',
    de: 'Warum ISO Order Portal für Ihre ISO-Zertifikate wählen',
    es: 'Razones para elegir ISO Order Portal para tus certificados ISO',
    pt: 'Motivos para escolher a ISO Order Portal para os seus certificados ISO',
    it: 'Perché scegliere ISO Order Portal per i tuoi certificati ISO'
  },
  'Simple User Interface': { fr: 'Interface utilisateur simple', de: 'Einfache Benutzeroberfläche', es: 'Interfaz de usuario sencilla', pt: 'Interface de utilizador simples', it: 'Interfaccia utente semplice' },
  'A cloud-based layout ensures that companies of all sizes can easily finish and request certificates online.': {
    fr: 'Une interface basée sur le cloud permet aux entreprises de toutes tailles de finaliser et demander leurs certificats en ligne facilement.',
    de: 'Ein cloudbasiertes Layout stellt sicher, dass Unternehmen jeder Größe Zertifikate problemlos online abschließen und beantragen können.',
    es: 'Un diseño en la nube garantiza que empresas de cualquier tamaño puedan completar y solicitar certificados en línea fácilmente.',
    pt: 'Um layout baseado na nuvem garante que empresas de todas as dimensões possam concluir e solicitar certificados online facilmente.',
    it: 'Un’interfaccia basata sul cloud garantisce che aziende di ogni dimensione possano completare e richiedere certificati online con facilità.'
  },
  'Remote Access': { fr: 'Accès à distance', de: 'Fernzugriff', es: 'Acceso remoto', pt: 'Acesso remoto', it: 'Accesso remoto' },
  'Our pipeline is accessible securely from any device, anytime. No complex manual files, no hard geographical borders.': {
    fr: 'Notre plateforme est accessible en toute sécurité depuis n’importe quel appareil, à tout moment. Fini les dossiers manuels complexes et les frontières géographiques.',
    de: 'Unsere Plattform ist jederzeit sicher von jedem Gerät aus zugänglich. Keine komplizierten Papierakten, keine geografischen Grenzen.',
    es: 'Nuestra plataforma es accesible de forma segura desde cualquier dispositivo, en cualquier momento. Sin expedientes manuales complejos ni fronteras geográficas.',
    pt: 'A nossa plataforma é acessível de forma segura a partir de qualquer dispositivo, a qualquer momento. Sem processos manuais complexos nem fronteiras geográficas.',
    it: 'La nostra piattaforma è accessibile in modo sicuro da qualsiasi dispositivo, in qualsiasi momento. Niente pratiche manuali complesse, niente confini geografici.'
  },
  'Cost Effective': { fr: 'Rentable', de: 'Kosteneffizient', es: 'Rentable', pt: 'Económico', it: 'Conveniente' },
  'With a one-time fixed fee and zero hidden advisor cost, we make quality compliance budget-friendly for small and large teams.': {
    fr: 'Avec des frais fixes uniques et aucun coût de conseil caché, nous rendons la conformité de qualité accessible aux petites comme aux grandes équipes.',
    de: 'Mit einer einmaligen Pauschalgebühr und ohne versteckte Beraterkosten machen wir hochwertige Compliance für kleine und große Teams erschwinglich.',
    es: 'Con una tarifa fija única y sin costes de asesoría ocultos, hacemos que el cumplimiento de calidad sea asequible para equipos pequeños y grandes.',
    pt: 'Com uma taxa fixa única e sem custos de consultoria ocultos, tornamos a conformidade de qualidade acessível para equipas pequenas e grandes.',
    it: 'Con una tariffa fissa unica e nessun costo di consulenza nascosto, rendiamo la conformità di qualità accessibile a team piccoli e grandi.'
  },
  'ISO Order Portal streamlines international certification with localized Arabic support, guiding you through modern steps.': {
    fr: 'ISO Order Portal simplifie la certification internationale avec un support en arabe localisé, en vous guidant à travers des étapes modernes.',
    de: 'ISO Order Portal vereinfacht die internationale Zertifizierung mit lokalisiertem arabischem Support und führt Sie durch moderne Schritte.',
    es: 'ISO Order Portal simplifica la certificación internacional con soporte localizado en árabe, guiándote a través de pasos modernos.',
    pt: 'A ISO Order Portal simplifica a certificação internacional com suporte localizado em árabe, guiando-o através de etapas modernas.',
    it: 'ISO Order Portal semplifica la certificazione internazionale con supporto localizzato in arabo, guidandoti attraverso passaggi moderni.'
  },
  'BASED IN DUBAI': { fr: 'BASÉ À DUBAÏ', de: 'MIT SITZ IN DUBAI', es: 'CON SEDE EN DUBÁI', pt: 'SEDIADA NO DUBAI', it: 'CON SEDE A DUBAI' },
  'Rapid Global Processing': { fr: 'Traitement mondial rapide', de: 'Schnelle weltweite Bearbeitung', es: 'Tramitación global rápida', pt: 'Processamento global rápido', it: 'Elaborazione globale rapida' },
  'Choose Your Standard': { fr: 'Choisissez votre norme', de: 'Wählen Sie Ihre Norm', es: 'Elige tu norma', pt: 'Escolha a sua norma', it: 'Scegli il tuo standard' },
  'Select your desired framework (ISO 9001, 14001, etc.) and complete your initial business profile details.': {
    fr: 'Sélectionnez le référentiel souhaité (ISO 9001, 14001, etc.) et complétez le profil initial de votre entreprise.',
    de: 'Wählen Sie das gewünschte Regelwerk (ISO 9001, 14001 usw.) und vervollständigen Sie Ihr erstes Unternehmensprofil.',
    es: 'Selecciona la norma que desees (ISO 9001, 14001, etc.) y completa los datos iniciales de tu perfil empresarial.',
    pt: 'Selecione a norma pretendida (ISO 9001, 14001, etc.) e complete os dados iniciais do seu perfil empresarial.',
    it: 'Seleziona lo standard desiderato (ISO 9001, 14001, ecc.) e completa i dati iniziali del profilo aziendale.'
  },
  'Upload Documentation': { fr: 'Téléverser les documents', de: 'Dokumente hochladen', es: 'Subir documentación', pt: 'Carregar documentação', it: 'Carica la documentazione' },
  'Upload required documents via our secure dashboard guided by intuitive auditor checklists for rapid review.': {
    fr: 'Téléversez les documents requis via notre tableau de bord sécurisé, guidé par des listes de contrôle intuitives pour un examen rapide.',
    de: 'Laden Sie die erforderlichen Dokumente über unser sicheres Dashboard hoch, geleitet durch intuitive Prüflisten für eine schnelle Prüfung.',
    es: 'Sube los documentos necesarios a través de nuestro panel seguro, guiado por listas de verificación intuitivas para una revisión rápida.',
    pt: 'Carregue os documentos necessários através do nosso painel seguro, guiado por listas de verificação intuitivas para uma revisão rápida.',
    it: 'Carica i documenti richiesti tramite la nostra dashboard sicura, guidata da liste di controllo intuitive per una revisione rapida.'
  },
  'Receive Certificate': { fr: 'Recevez votre certificat', de: 'Zertifikat erhalten', es: 'Recibe tu certificado', pt: 'Receba o certificado', it: 'Ricevi il certificato' },
  'Upon successful virtual audit, download your certified PDF immediately and receive secure printed copies.': {
    fr: 'Après un audit virtuel réussi, téléchargez immédiatement votre PDF certifié et recevez des exemplaires imprimés sécurisés.',
    de: 'Nach erfolgreichem virtuellem Audit können Sie Ihr zertifiziertes PDF sofort herunterladen und erhalten sichere gedruckte Exemplare.',
    es: 'Tras una auditoría virtual exitosa, descarga tu PDF certificado de inmediato y recibe copias impresas seguras.',
    pt: 'Após uma auditoria virtual bem-sucedida, descarregue o seu PDF certificado imediatamente e receba cópias impressas seguras.',
    it: 'Dopo un audit virtuale positivo, scarica subito il tuo PDF certificato e ricevi copie stampate sicure.'
  },
  'Full Transparency': { fr: 'Transparence totale', de: 'Volle Transparenz', es: 'Transparencia total', pt: 'Transparência total', it: 'Trasparenza totale' },
  'Verify Any ISO Certificate Instantly': { fr: 'Vérifiez instantanément tout certificat ISO', de: 'Jedes ISO-Zertifikat sofort überprüfen', es: 'Verifica al instante cualquier certificado ISO', pt: 'Verifique instantaneamente qualquer certificado ISO', it: 'Verifica istantaneamente qualsiasi certificato ISO' },
  'Every certificate we issue is instantly verifiable through IAF CertSearch, the official global registry for internationally accredited certifications. Watch how your clients and partners can confirm your certificate is genuine in seconds.': {
    fr: 'Chaque certificat que nous délivrons est instantanément vérifiable via IAF CertSearch, le registre mondial officiel des certifications accréditées à l’international. Découvrez comment vos clients et partenaires peuvent confirmer l’authenticité de votre certificat en quelques secondes.',
    de: 'Jedes von uns ausgestellte Zertifikat kann sofort über IAF CertSearch überprüft werden, das offizielle globale Register für international akkreditierte Zertifizierungen. Sehen Sie, wie Ihre Kunden und Partner die Echtheit Ihres Zertifikats in Sekunden bestätigen können.',
    es: 'Cada certificado que emitimos puede verificarse al instante en IAF CertSearch, el registro oficial global de certificaciones acreditadas internacionalmente. Descubre cómo tus clientes y socios pueden confirmar que tu certificado es auténtico en segundos.',
    pt: 'Cada certificado que emitimos pode ser verificado instantaneamente no IAF CertSearch, o registo oficial global de certificações acreditadas internacionalmente. Veja como os seus clientes e parceiros podem confirmar que o seu certificado é genuíno em segundos.',
    it: 'Ogni certificato che rilasciamo è verificabile all’istante su IAF CertSearch, il registro globale ufficiale delle certificazioni accreditate a livello internazionale. Scopri come i tuoi clienti e partner possono confermare l’autenticità del tuo certificato in pochi secondi.'
  },
  'Visit IAF CertSearch': { fr: 'Visiter IAF CertSearch', de: 'IAF CertSearch besuchen', es: 'Visitar IAF CertSearch', pt: 'Visitar o IAF CertSearch', it: 'Visita IAF CertSearch' },
  'Your browser does not support the video tag.': {
    fr: 'Votre navigateur ne prend pas en charge la lecture de vidéos.',
    de: 'Ihr Browser unterstützt das Video-Tag nicht.',
    es: 'Tu navegador no admite la etiqueta de vídeo.',
    pt: 'O seu navegador não suporta a tag de vídeo.',
    it: 'Il tuo browser non supporta il tag video.'
  },
  'Pricing & Accredited Standards': { fr: 'Tarifs et normes accréditées', de: 'Preise & akkreditierte Normen', es: 'Precios y normas acreditadas', pt: 'Preços e normas acreditadas', it: 'Prezzi e standard accreditati' },
  'Clear pricing structure for maximum organization value, speed, and absolute transparency.': {
    fr: 'Une structure tarifaire claire pour un maximum de valeur, de rapidité et une transparence absolue.',
    de: 'Eine klare Preisstruktur für maximalen Mehrwert, Geschwindigkeit und absolute Transparenz.',
    es: 'Una estructura de precios clara para el máximo valor, rapidez y transparencia absoluta.',
    pt: 'Uma estrutura de preços clara para o máximo valor, rapidez e transparência absoluta.',
    it: 'Una struttura tariffaria chiara per il massimo valore, velocità e trasparenza assoluta.'
  },
  'Quality Management System': { fr: 'Système de management de la qualité', de: 'Qualitätsmanagementsystem', es: 'Sistema de gestión de calidad', pt: 'Sistema de gestão da qualidade', it: 'Sistema di gestione della qualità' },
  'Fixed fee': { fr: 'Frais fixes', de: 'Festgebühr', es: 'Tarifa fija', pt: 'Taxa fixa', it: 'Tariffa fissa' },
  'Features Included:': { fr: 'Fonctionnalités incluses :', de: 'Enthaltene Leistungen:', es: 'Características incluidas:', pt: 'Funcionalidades incluídas:', it: 'Funzionalità incluse:' },
  'Globally Recognized & Verifiable': { fr: 'Reconnu et vérifiable mondialement', de: 'Weltweit anerkannt & überprüfbar', es: 'Reconocido y verificable a nivel mundial', pt: 'Reconhecido e verificável globalmente', it: 'Riconosciuto e verificabile a livello globale' },
  'Full Document Prep & Guided Audit': { fr: 'Préparation complète des documents et audit guidé', de: 'Vollständige Dokumentenvorbereitung & begleitetes Audit', es: 'Preparación completa de documentos y auditoría guiada', pt: 'Preparação completa de documentos e auditoria orientada', it: 'Preparazione completa dei documenti e audit guidato' },
  '3-Year Certified Validity': { fr: 'Validité certifiée de 3 ans', de: '3 Jahre zertifizierte Gültigkeit', es: 'Validez certificada de 3 años', pt: 'Validade certificada de 3 anos', it: 'Validità certificata di 3 anni' },
  'Complimentary Auditor Training': { fr: 'Formation d’auditeur offerte', de: 'Kostenlose Auditorenschulung', es: 'Formación de auditor gratuita', pt: 'Formação de auditor gratuita', it: 'Formazione auditor gratuita' },
  'Buy Now': { fr: 'Acheter maintenant', de: 'Jetzt kaufen', es: 'Comprar ahora', pt: 'Comprar agora', it: 'Acquista ora' },
  'Environmental Management': { fr: 'Management environnemental', de: 'Umweltmanagement', es: 'Gestión ambiental', pt: 'Gestão ambiental', it: 'Gestione ambientale' },
  'Occupational Health & Safety': { fr: 'Santé et sécurité au travail', de: 'Arbeitsschutz und Sicherheit', es: 'Salud y seguridad ocupacional', pt: 'Saúde e segurança ocupacional', it: 'Salute e sicurezza sul lavoro' },
  'BEST VALUE PACKAGE': { fr: 'MEILLEUR RAPPORT QUALITÉ-PRIX', de: 'BESTES PREIS-LEISTUNGS-PAKET', es: 'PAQUETE DE MEJOR VALOR', pt: 'PACOTE DE MELHOR VALOR', it: 'PACCHETTO MIGLIOR VALORE' },
  'Integrated Management System': { fr: 'Système de management intégré', de: 'Integriertes Managementsystem', es: 'Sistema de gestión integrado', pt: 'Sistema de gestão integrado', it: 'Sistema di gestione integrato' },
  'ISO 9001, 14001, and 45001 combined.': {
    fr: 'ISO 9001, 14001 et 45001 combinées.',
    de: 'ISO 9001, 14001 und 45001 kombiniert.',
    es: 'ISO 9001, 14001 y 45001 combinadas.',
    pt: 'ISO 9001, 14001 e 45001 combinadas.',
    it: 'ISO 9001, 14001 e 45001 combinate.'
  },
  'All-inclusive fee': { fr: 'Tarif tout inclus', de: 'Komplettgebühr', es: 'Tarifa todo incluido', pt: 'Taxa tudo incluído', it: 'Tariffa tutto incluso' },
  'IMS Premium Features:': { fr: 'Fonctionnalités premium IMS :', de: 'IMS-Premium-Leistungen:', es: 'Características premium de IMS:', pt: 'Funcionalidades premium do IMS:', it: 'Funzionalità premium IMS:' },
  '3 Fully Verified ISO Certificates': { fr: '3 certificats ISO entièrement vérifiés', de: '3 vollständig verifizierte ISO-Zertifikate', es: '3 certificados ISO totalmente verificados', pt: '3 certificados ISO totalmente verificados', it: '3 certificati ISO completamente verificati' },
  'Save Over AED 2,000 Instantly': { fr: 'Économisez plus de 2 000 AED instantanément', de: 'Sofort über 2.000 AED sparen', es: 'Ahorra más de 2.000 AED al instante', pt: 'Poupe mais de 2.000 AED instantaneamente', it: 'Risparmia oltre 2.000 AED all’istante' },
  'Unified Auditor Compliance Stream': { fr: 'Processus d’audit unifié', de: 'Einheitlicher Audit-Compliance-Prozess', es: 'Proceso de auditoría de cumplimiento unificado', pt: 'Processo unificado de auditoria de conformidade', it: 'Processo di audit di conformità unificato' },
  'Priority Support & Dedicated Auditor': { fr: 'Support prioritaire et auditeur dédié', de: 'Prioritäts-Support & fester Auditor', es: 'Soporte prioritario y auditor dedicado', pt: 'Suporte prioritário e auditor dedicado', it: 'Supporto prioritario e auditor dedicato' },
  'Buy IMS Bundle': { fr: 'Acheter le pack IMS', de: 'IMS-Paket kaufen', es: 'Comprar paquete IMS', pt: 'Comprar pacote IMS', it: 'Acquista il pacchetto IMS' },
  'Meet regulatory compliance, improve operational efficiency, and build trust with local and international partners in competitive markets today.': {
    fr: 'Assurez votre conformité réglementaire, améliorez votre efficacité opérationnelle et bâtissez la confiance avec des partenaires locaux et internationaux sur des marchés compétitifs.',
    de: 'Erfüllen Sie regulatorische Anforderungen, steigern Sie die betriebliche Effizienz und schaffen Sie Vertrauen bei lokalen und internationalen Partnern in wettbewerbsintensiven Märkten.',
    es: 'Cumple con la normativa, mejora la eficiencia operativa y genera confianza con socios locales e internacionales en mercados competitivos.',
    pt: 'Cumpra a conformidade regulatória, melhore a eficiência operacional e construa confiança com parceiros locais e internacionais em mercados competitivos.',
    it: 'Rispetta la conformità normativa, migliora l’efficienza operativa e costruisci fiducia con partner locali e internazionali in mercati competitivi.'
  },
  '100% Online': { fr: '100 % en ligne', de: '100 % online', es: '100% en línea', pt: '100% online', it: '100% online' },
  'Lead Auditor Training Standards': { fr: 'Normes de formation Lead Auditor', de: 'Lead-Auditor-Schulungsnormen', es: 'Normas de formación de Auditor Líder', pt: 'Normas de formação de Auditor Líder', it: 'Standard di formazione Lead Auditor' },
  'All Lead Auditor training courses are delivered fully online, so your team can qualify without travel or in-person attendance.': {
    fr: 'Toutes les formations Lead Auditor sont dispensées entièrement en ligne, permettant à votre équipe de se qualifier sans déplacement ni présence physique.',
    de: 'Alle Lead-Auditor-Schulungen finden vollständig online statt, sodass sich Ihr Team ohne Reisen oder Präsenzteilnahme qualifizieren kann.',
    es: 'Todos los cursos de formación de Auditor Líder se imparten totalmente en línea, para que tu equipo pueda cualificarse sin viajar ni asistir presencialmente.',
    pt: 'Todos os cursos de formação de Auditor Líder são realizados totalmente online, para que a sua equipa se possa qualificar sem viajar ou comparecer presencialmente.',
    it: 'Tutti i corsi di formazione Lead Auditor si svolgono interamente online, così il tuo team può qualificarsi senza viaggiare o partecipare di persona.'
  },
  'Lead Auditor': { fr: 'Auditeur principal', de: 'Lead Auditor', es: 'Auditor líder', pt: 'Auditor líder', it: 'Lead Auditor' },
  'Request Info': { fr: 'Demander des infos', de: 'Infos anfordern', es: 'Solicitar información', pt: 'Solicitar informações', it: 'Richiedi informazioni' },
  'Ask About Course Schedules': { fr: 'Demander les dates de formation', de: 'Nach Schulungsterminen fragen', es: 'Preguntar por las fechas de los cursos', pt: 'Perguntar sobre as datas dos cursos', it: 'Chiedi le date dei corsi' },
  'Referral Program': { fr: 'Programme de parrainage', de: 'Empfehlungsprogramm', es: 'Programa de referidos', pt: 'Programa de indicações', it: 'Programma di referral' },
  'Refer a Client, Earn AED 500': { fr: 'Parrainez un client, gagnez 500 AED', de: 'Kunden empfehlen, 500 AED verdienen', es: 'Recomienda a un cliente, gana 500 AED', pt: 'Indique um cliente, ganhe 500 AED', it: 'Segnala un cliente, guadagna 500 AED' },
  'Join free and get your own referral link instantly. For every client you refer who completes payment for an ISO certificate, you earn AED 500.': {
    fr: 'Inscrivez-vous gratuitement et obtenez instantanément votre propre lien de parrainage. Pour chaque client que vous parrainez et qui règle un certificat ISO, vous gagnez 500 AED.',
    de: 'Kostenlos anmelden und sofort Ihren eigenen Empfehlungslink erhalten. Für jeden geworbenen Kunden, der ein ISO-Zertifikat bezahlt, erhalten Sie 500 AED.',
    es: 'Únete gratis y obtén al instante tu propio enlace de referido. Por cada cliente que refieras y complete el pago de un certificado ISO, ganas 500 AED.',
    pt: 'Junte-se gratuitamente e obtenha instantaneamente o seu próprio link de indicação. Por cada cliente que indicar e que efetue o pagamento de um certificado ISO, ganha 500 AED.',
    it: 'Iscriviti gratuitamente e ottieni subito il tuo link di referral personale. Per ogni cliente che segnali e che completa il pagamento di un certificato ISO, guadagni 500 AED.'
  },
  'Join Now & Get Your Link': { fr: 'Inscrivez-vous et obtenez votre lien', de: 'Jetzt beitreten & Link erhalten', es: 'Únete ahora y obtén tu enlace', pt: 'Junte-se agora e obtenha o seu link', it: 'Iscriviti ora e ottieni il tuo link' },
  'Business Growth with Accessible ISO Certification and Training': {
    fr: 'Développez votre entreprise avec une certification et une formation ISO accessibles',
    de: 'Unternehmenswachstum durch zugängliche ISO-Zertifizierung und Schulung',
    es: 'Crecimiento empresarial con certificación y formación ISO accesibles',
    pt: 'Crescimento empresarial com certificação e formação ISO acessíveis',
    it: 'Crescita aziendale con certificazione e formazione ISO accessibili'
  },
  'Meet regulatory compliance, improve operational efficiency, and build trust with local and international partners in competitive markets globally.': {
    fr: 'Assurez votre conformité réglementaire, améliorez votre efficacité opérationnelle et bâtissez la confiance avec des partenaires locaux et internationaux sur des marchés compétitifs à l’échelle mondiale.',
    de: 'Erfüllen Sie regulatorische Anforderungen, steigern Sie die betriebliche Effizienz und schaffen Sie Vertrauen bei lokalen und internationalen Partnern auf wettbewerbsintensiven Märkten weltweit.',
    es: 'Cumple con la normativa, mejora la eficiencia operativa y genera confianza con socios locales e internacionales en mercados competitivos de todo el mundo.',
    pt: 'Cumpra a conformidade regulatória, melhore a eficiência operacional e construa confiança com parceiros locais e internacionais em mercados competitivos globalmente.',
    it: 'Rispetta la conformità normativa, migliora l’efficienza operativa e costruisci fiducia con partner locali e internazionali in mercati competitivi a livello globale.'
  },
  'Order Now': { fr: 'Commander maintenant', de: 'Jetzt bestellen', es: 'Pedir ahora', pt: 'Encomendar agora', it: 'Ordina ora' },
  'Contact us': { fr: 'Contactez-nous', de: 'Kontaktieren Sie uns', es: 'Contáctenos', pt: 'Fale connosco', it: 'Contattaci' },
  'Message Sent Successfully!': { fr: 'Message envoyé avec succès !', de: 'Nachricht erfolgreich gesendet!', es: '¡Mensaje enviado con éxito!', pt: 'Mensagem enviada com sucesso!', it: 'Messaggio inviato con successo!' },
  'Thank you! Your message has been sent successfully. One of our qualified ISO auditors will contact you shortly.': {
    fr: 'Merci ! Votre message a bien été envoyé. L’un de nos auditeurs ISO qualifiés vous contactera prochainement.',
    de: 'Vielen Dank! Ihre Nachricht wurde erfolgreich gesendet. Einer unserer qualifizierten ISO-Auditoren wird sich in Kürze bei Ihnen melden.',
    es: '¡Gracias! Tu mensaje se ha enviado correctamente. Uno de nuestros auditores ISO cualificados se pondrá en contacto contigo en breve.',
    pt: 'Obrigado! A sua mensagem foi enviada com sucesso. Um dos nossos auditores ISO qualificados entrará em contacto em breve.',
    it: 'Grazie! Il tuo messaggio è stato inviato con successo. Uno dei nostri auditor ISO qualificati ti contatterà a breve.'
  },
  'Contact Name:': { fr: 'Nom du contact :', de: 'Name der Kontaktperson:', es: 'Nombre de contacto:', pt: 'Nome de contacto:', it: 'Nome del referente:' },
  'Business Name:': { fr: 'Nom de l’entreprise :', de: 'Firmenname:', es: 'Nombre de la empresa:', pt: 'Nome da empresa:', it: 'Ragione sociale:' },
  'Telephone Number:': { fr: 'Numéro de téléphone :', de: 'Telefonnummer:', es: 'Número de teléfono:', pt: 'Número de telefone:', it: 'Numero di telefono:' },
  '(Include area code)': { fr: '(Indicatif inclus)', de: '(inkl. Vorwahl)', es: '(Incluye el código de área)', pt: '(Inclua o indicativo)', it: '(Incluso prefisso)' },
  'Email': { fr: 'E-mail', de: 'E-Mail', es: 'Correo electrónico', pt: 'E-mail', it: 'E-mail' },
  'This enquiry is for company ISO certification only (Not Individual ISO Training Courses)': {
    fr: 'Cette demande concerne uniquement la certification ISO d’entreprise (pas les formations ISO individuelles)',
    de: 'Diese Anfrage betrifft ausschließlich die ISO-Zertifizierung von Unternehmen (nicht individuelle ISO-Schulungen)',
    es: 'Esta consulta es solo para la certificación ISO de empresas (no para cursos individuales de formación ISO)',
    pt: 'Esta consulta destina-se apenas à certificação ISO de empresas (não a cursos individuais de formação ISO)',
    it: 'Questa richiesta riguarda solo la certificazione ISO aziendale (non i corsi di formazione ISO individuali)'
  },
  'Send': { fr: 'Envoyer', de: 'Senden', es: 'Enviar', pt: 'Enviar', it: 'Invia' },
  'As a fully digital ISO certification platform with integrated training capabilities and dedicated help desk support, ISO Order Portal collaborates with a select network of ISO consultants around the world who leverage our online platform to deliver certification services to their clients efficiently and at scale.': {
    fr: 'En tant que plateforme de certification ISO entièrement numérique, dotée de capacités de formation intégrées et d’une assistance dédiée, ISO Order Portal collabore avec un réseau sélectionné de consultants ISO dans le monde entier qui utilisent notre plateforme pour fournir des services de certification à leurs clients efficacement et à grande échelle.',
    de: 'Als vollständig digitale ISO-Zertifizierungsplattform mit integrierten Schulungsfunktionen und eigenem Support arbeitet ISO Order Portal mit einem ausgewählten Netzwerk von ISO-Beratern weltweit zusammen, die unsere Plattform nutzen, um Zertifizierungsdienstleistungen effizient und skalierbar an ihre Kunden zu liefern.',
    es: 'Como plataforma de certificación ISO totalmente digital, con capacidades de formación integradas y soporte técnico dedicado, ISO Order Portal colabora con una red seleccionada de consultores ISO en todo el mundo que utilizan nuestra plataforma para ofrecer servicios de certificación a sus clientes de forma eficiente y a gran escala.',
    pt: 'Como plataforma de certificação ISO totalmente digital, com capacidades de formação integradas e suporte técnico dedicado, a ISO Order Portal colabora com uma rede selecionada de consultores ISO em todo o mundo que utilizam a nossa plataforma para prestar serviços de certificação aos seus clientes de forma eficiente e em grande escala.',
    it: 'In qualità di piattaforma di certificazione ISO completamente digitale, con funzionalità di formazione integrate e assistenza dedicata, ISO Order Portal collabora con una rete selezionata di consulenti ISO in tutto il mondo che utilizzano la nostra piattaforma per fornire servizi di certificazione ai propri clienti in modo efficiente e su larga scala.'
  },
  'Our consultant partners benefit from a ready-made digital infrastructure, accredited certification pathways, and multilingual support, including the only full Arabic-language ISO training platform of its kind globally.': {
    fr: 'Nos partenaires consultants bénéficient d’une infrastructure numérique clé en main, de parcours de certification accrédités et d’un support multilingue, y compris la seule plateforme de formation ISO entièrement en arabe de ce type au monde.',
    de: 'Unsere Beraterpartner profitieren von einer fertigen digitalen Infrastruktur, akkreditierten Zertifizierungswegen und mehrsprachigem Support – einschließlich der weltweit einzigen vollständig arabischsprachigen ISO-Schulungsplattform ihrer Art.',
    es: 'Nuestros socios consultores se benefician de una infraestructura digital lista para usar, rutas de certificación acreditadas y soporte multilingüe, incluyendo la única plataforma de formación ISO totalmente en árabe de su tipo a nivel mundial.',
    pt: 'Os nossos parceiros consultores beneficiam de uma infraestrutura digital pronta a usar, percursos de certificação acreditados e suporte multilingue, incluindo a única plataforma de formação ISO totalmente em árabe do seu género a nível mundial.',
    it: 'I nostri partner consulenti beneficiano di un’infrastruttura digitale pronta all’uso, percorsi di certificazione accreditati e supporto multilingue, inclusa l’unica piattaforma di formazione ISO interamente in arabo di questo tipo a livello mondiale.'
  },
  'If you are an established ISO consultant looking to broaden your service offering, expand into new markets, or streamline your delivery through a trusted digital partner, we would be pleased to explore how a collaboration could work.': {
    fr: 'Si vous êtes un consultant ISO établi cherchant à élargir votre offre de services, vous développer sur de nouveaux marchés ou simplifier votre prestation grâce à un partenaire numérique de confiance, nous serions ravis d’explorer une éventuelle collaboration.',
    de: 'Wenn Sie ein etablierter ISO-Berater sind und Ihr Leistungsangebot erweitern, in neue Märkte expandieren oder Ihre Leistungserbringung über einen vertrauenswürdigen digitalen Partner optimieren möchten, erkunden wir gerne gemeinsam eine mögliche Zusammenarbeit.',
    es: 'Si eres un consultor ISO consolidado que busca ampliar su oferta de servicios, expandirse a nuevos mercados o simplificar su prestación de servicios a través de un socio digital de confianza, nos encantaría explorar cómo podría funcionar una colaboración.',
    pt: 'Se é um consultor ISO estabelecido que procura ampliar a sua oferta de serviços, expandir-se para novos mercados ou simplificar a prestação de serviços através de um parceiro digital de confiança, teremos todo o gosto em explorar como poderia funcionar uma colaboração.',
    it: 'Se sei un consulente ISO affermato e desideri ampliare la tua offerta di servizi, espanderti in nuovi mercati o semplificare l’erogazione dei servizi tramite un partner digitale affidabile, saremo lieti di esplorare insieme una possibile collaborazione.'
  },
  'Drop us an email at iso@gloria-c.com with information about your consultancy, the standards you work with, and the markets you cover, and one of our team will get back to you to arrange a call.': {
    fr: 'Envoyez-nous un e-mail à iso@gloria-c.com avec des informations sur votre cabinet de conseil, les normes sur lesquelles vous travaillez et les marchés que vous couvrez ; un membre de notre équipe vous recontactera pour planifier un appel.',
    de: 'Senden Sie uns eine E-Mail an iso@gloria-c.com mit Informationen zu Ihrer Beratungstätigkeit, den Normen, mit denen Sie arbeiten, und den Märkten, die Sie abdecken. Ein Mitglied unseres Teams meldet sich bei Ihnen, um einen Anruf zu vereinbaren.',
    es: 'Envíanos un correo a iso@gloria-c.com con información sobre tu consultoría, las normas con las que trabajas y los mercados que cubres, y un miembro de nuestro equipo se pondrá en contacto contigo para concertar una llamada.',
    pt: 'Envie-nos um e-mail para iso@gloria-c.com com informações sobre a sua consultoria, as normas com que trabalha e os mercados que abrange, e um membro da nossa equipa entrará em contacto para agendar uma chamada.',
    it: 'Inviaci un’e-mail a iso@gloria-c.com con informazioni sulla tua consulenza, gli standard con cui lavori e i mercati che copri, e un membro del nostro team ti ricontatterà per fissare una chiamata.'
  },
  'Frequently Asked Questions': { fr: 'Foire aux questions', de: 'Häufig gestellte Fragen', es: 'Preguntas frecuentes', pt: 'Perguntas frequentes', it: 'Domande frequenti' },
  'ISO Order Portal Worldwide Offices': { fr: 'Bureaux ISO Order Portal dans le monde', de: 'ISO Order Portal Standorte weltweit', es: 'Oficinas de ISO Order Portal en el mundo', pt: 'Escritórios da ISO Order Portal no mundo', it: 'Uffici ISO Order Portal nel mondo' },
  'United Arab Emirates': { fr: 'Émirats arabes unis', de: 'Vereinigte Arabische Emirate', es: 'Emiratos Árabes Unidos', pt: 'Emirados Árabes Unidos', it: 'Emirati Arabi Uniti' },
  'Al Garhoud, Dubai, United Arab Emirates.': { fr: 'Al Garhoud, Dubaï, Émirats arabes unis.', de: 'Al Garhoud, Dubai, Vereinigte Arabische Emirate.', es: 'Al Garhoud, Dubái, Emiratos Árabes Unidos.', pt: 'Al Garhoud, Dubai, Emirados Árabes Unidos.', it: 'Al Garhoud, Dubai, Emirati Arabi Uniti.' },
  'United Kingdom': { fr: 'Royaume-Uni', de: 'Vereinigtes Königreich', es: 'Reino Unido', pt: 'Reino Unido', it: 'Regno Unito' },
  'Since 2015, ISO Order Portal has been redefining ISO certification. Our 100% online platform helps small and medium-sized businesses get certified quickly and confidently.': {
    fr: 'Depuis 2015, ISO Order Portal redéfinit la certification ISO. Notre plateforme 100 % en ligne aide les PME à se faire certifier rapidement et en toute confiance.',
    de: 'Seit 2015 definiert ISO Order Portal die ISO-Zertifizierung neu. Unsere 100 % Online-Plattform hilft kleinen und mittleren Unternehmen, sich schnell und sicher zertifizieren zu lassen.',
    es: 'Desde 2015, ISO Order Portal redefine la certificación ISO. Nuestra plataforma 100% en línea ayuda a las pequeñas y medianas empresas a certificarse de forma rápida y segura.',
    pt: 'Desde 2015, a ISO Order Portal tem redefinido a certificação ISO. A nossa plataforma 100% online ajuda pequenas e médias empresas a certificarem-se de forma rápida e confiante.',
    it: 'Dal 2015, ISO Order Portal ridefinisce la certificazione ISO. La nostra piattaforma 100% online aiuta le piccole e medie imprese a certificarsi in modo rapido e sicuro.'
  },
  'We simplify every step providing continuous online guidance, clear pricing, and trusted support to make certification effortless and affordable.': {
    fr: 'Nous simplifions chaque étape en offrant un accompagnement en ligne continu, des tarifs clairs et un support de confiance pour rendre la certification simple et abordable.',
    de: 'Wir vereinfachen jeden Schritt durch fortlaufende Online-Beratung, klare Preise und vertrauenswürdigen Support, um die Zertifizierung mühelos und erschwinglich zu machen.',
    es: 'Simplificamos cada paso ofreciendo orientación continua en línea, precios claros y soporte de confianza para que la certificación sea sencilla y asequible.',
    pt: 'Simplificamos cada etapa, oferecendo orientação online contínua, preços claros e suporte de confiança para tornar a certificação simples e acessível.',
    it: 'Semplifichiamo ogni passaggio offrendo assistenza online continua, prezzi chiari e supporto affidabile per rendere la certificazione semplice ed economica.'
  },
  'Quick Links': { fr: 'Liens rapides', de: 'Schnellzugriff', es: 'Enlaces rápidos', pt: 'Links rápidos', it: 'Link rapidi' },
  'About Us': { fr: 'À propos de nous', de: 'Über uns', es: 'Sobre nosotros', pt: 'Sobre nós', it: 'Chi siamo' },
  'Pricing': { fr: 'Tarifs', de: 'Preise', es: 'Precios', pt: 'Preços', it: 'Prezzi' },
  'Why Us': { fr: 'Pourquoi nous', de: 'Warum wir', es: 'Por qué nosotros', pt: 'Porquê nós', it: 'Perché noi' },
  'Get Certified In 7 Days': { fr: 'Certifiez-vous en 7 jours', de: 'In 7 Tagen zertifiziert werden', es: 'Certifícate en 7 días', pt: 'Certifique-se em 7 dias', it: 'Certificati in 7 giorni' },
  'WhatsApp Chat Support': { fr: 'Assistance WhatsApp', de: 'WhatsApp-Support', es: 'Soporte por WhatsApp', pt: 'Suporte via WhatsApp', it: 'Assistenza WhatsApp' },
  'News Letter': { fr: 'Newsletter', de: 'Newsletter', es: 'Boletín informativo', pt: 'Newsletter', it: 'Newsletter' },
  'Subscribed successfully! Thank you.': { fr: 'Inscription réussie ! Merci.', de: 'Erfolgreich abonniert! Vielen Dank.', es: '¡Suscripción exitosa! Gracias.', pt: 'Subscrição efetuada com sucesso! Obrigado.', it: 'Iscrizione riuscita! Grazie.' },
  'Enter your email address': { fr: 'Saisissez votre adresse e-mail', de: 'Geben Sie Ihre E-Mail-Adresse ein', es: 'Introduce tu correo electrónico', pt: 'Introduza o seu e-mail', it: 'Inserisci il tuo indirizzo e-mail' },
  'Powered by Stripe security payments': { fr: 'Paiements sécurisés par Stripe', de: 'Sichere Zahlungen powered by Stripe', es: 'Pagos seguros con tecnología de Stripe', pt: 'Pagamentos seguros com tecnologia Stripe', it: 'Pagamenti sicuri offerti da Stripe' },
  'Request sent successfully!': { fr: 'Demande envoyée avec succès !', de: 'Anfrage erfolgreich gesendet!', es: '¡Solicitud enviada con éxito!', pt: 'Pedido enviado com sucesso!', it: 'Richiesta inviata con successo!' },
  'Thanks for your interest — our team will reach out shortly with course details and schedules.': {
    fr: 'Merci pour votre intérêt — notre équipe vous contactera prochainement avec les détails et horaires des formations.',
    de: 'Vielen Dank für Ihr Interesse — unser Team meldet sich in Kürze mit Kursdetails und Terminen bei Ihnen.',
    es: 'Gracias por tu interés: nuestro equipo se pondrá en contacto en breve con los detalles y horarios del curso.',
    pt: 'Obrigado pelo seu interesse — a nossa equipa entrará em contacto em breve com os detalhes e horários do curso.',
    it: 'Grazie per il tuo interesse: il nostro team ti contatterà a breve con i dettagli e gli orari del corso.'
  },
  'Close': { fr: 'Fermer', de: 'Schließen', es: 'Cerrar', pt: 'Fechar', it: 'Chiudi' },
  'Request Course Information': { fr: 'Demander des informations sur la formation', de: 'Kursinformationen anfordern', es: 'Solicitar información del curso', pt: 'Solicitar informações do curso', it: 'Richiedi informazioni sul corso' },
  "Fill in your details and we'll send you the full details.": {
    fr: 'Renseignez vos coordonnées et nous vous enverrons tous les détails.',
    de: 'Geben Sie Ihre Daten ein, und wir senden Ihnen alle Details zu.',
    es: 'Completa tus datos y te enviaremos todos los detalles.',
    pt: 'Preencha os seus dados e enviaremos todos os detalhes.',
    it: 'Inserisci i tuoi dati e ti invieremo tutti i dettagli.'
  },
  'Full Name': { fr: 'Nom complet', de: 'Vollständiger Name', es: 'Nombre completo', pt: 'Nome completo', it: 'Nome completo' },
  'Phone': { fr: 'Téléphone', de: 'Telefon', es: 'Teléfono', pt: 'Telefone', it: 'Telefono' },
  'Company (optional)': { fr: 'Entreprise (facultatif)', de: 'Unternehmen (optional)', es: 'Empresa (opcional)', pt: 'Empresa (opcional)', it: 'Azienda (facoltativo)' },
  'Course': { fr: 'Formation', de: 'Kurs', es: 'Curso', pt: 'Curso', it: 'Corso' },
  'Not sure / all courses': { fr: 'Pas sûr / toutes les formations', de: 'Unsicher / alle Kurse', es: 'No estoy seguro / todos los cursos', pt: 'Não tenho a certeza / todos os cursos', it: 'Non sono sicuro / tutti i corsi' },
  'Message (optional)': { fr: 'Message (facultatif)', de: 'Nachricht (optional)', es: 'Mensaje (opcional)', pt: 'Mensagem (opcional)', it: 'Messaggio (facoltativo)' },
  'Sending...': { fr: 'Envoi en cours...', de: 'Wird gesendet...', es: 'Enviando...', pt: 'A enviar...', it: 'Invio in corso...' },
  'Send Request': { fr: 'Envoyer la demande', de: 'Anfrage senden', es: 'Enviar solicitud', pt: 'Enviar pedido', it: 'Invia richiesta' },
  'Your link is ready!': { fr: 'Votre lien est prêt !', de: 'Ihr Link ist bereit!', es: '¡Tu enlace está listo!', pt: 'O seu link está pronto!', it: 'Il tuo link è pronto!' },
  "Share this link with your clients — you'll earn AED 500 for every one who completes payment through it. We've also emailed you a copy.": {
    fr: 'Partagez ce lien avec vos clients — vous gagnerez 500 AED pour chacun qui effectue un paiement via ce lien. Nous vous en avons également envoyé une copie par e-mail.',
    de: 'Teilen Sie diesen Link mit Ihren Kunden — Sie erhalten 500 AED für jeden, der darüber eine Zahlung abschließt. Wir haben Ihnen auch eine Kopie per E-Mail gesendet.',
    es: 'Comparte este enlace con tus clientes: ganarás 500 AED por cada uno que complete el pago a través de él. También te hemos enviado una copia por correo electrónico.',
    pt: 'Partilhe este link com os seus clientes — ganhará 500 AED por cada um que efetuar o pagamento através dele. Também lhe enviámos uma cópia por e-mail.',
    it: 'Condividi questo link con i tuoi clienti: guadagnerai 500 AED per ognuno che completa il pagamento tramite esso. Te ne abbiamo anche inviato una copia via e-mail.'
  },
  'Copied': { fr: 'Copié', de: 'Kopiert', es: 'Copiado', pt: 'Copiado', it: 'Copiato' },
  'Copy': { fr: 'Copier', de: 'Kopieren', es: 'Copiar', pt: 'Copiar', it: 'Copia' },
  'Join the Referral Program': { fr: 'Rejoindre le programme de parrainage', de: 'Dem Empfehlungsprogramm beitreten', es: 'Únete al programa de referidos', pt: 'Aderir ao programa de indicações', it: 'Unisciti al programma di referral' },
  'Fill in your details and get your own link instantly.': {
    fr: 'Renseignez vos coordonnées et obtenez instantanément votre propre lien.',
    de: 'Geben Sie Ihre Daten ein und erhalten Sie sofort Ihren eigenen Link.',
    es: 'Completa tus datos y obtén al instante tu propio enlace.',
    pt: 'Preencha os seus dados e obtenha instantaneamente o seu próprio link.',
    it: 'Inserisci i tuoi dati e ottieni subito il tuo link personale.'
  },
  'Phone (optional)': { fr: 'Téléphone (facultatif)', de: 'Telefon (optional)', es: 'Teléfono (opcional)', pt: 'Telefone (opcional)', it: 'Telefono (facoltativo)' },
  'Creating...': { fr: 'Création en cours...', de: 'Wird erstellt...', es: 'Creando...', pt: 'A criar...', it: 'Creazione in corso...' },
  'Get My Link': { fr: 'Obtenir mon lien', de: 'Meinen Link erhalten', es: 'Obtener mi enlace', pt: 'Obter o meu link', it: 'Ottieni il mio link' },
  'Chat with us on WhatsApp': { fr: 'Discutez avec nous sur WhatsApp', de: 'Chatten Sie mit uns auf WhatsApp', es: 'Chatea con nosotros por WhatsApp', pt: 'Converse connosco no WhatsApp', it: 'Chatta con noi su WhatsApp' },

  // FAQ
  'How long does ISO certification take through ISO Order Portal?': {
    fr: 'Combien de temps prend la certification ISO avec ISO Order Portal ?',
    de: 'Wie lange dauert die ISO-Zertifizierung über ISO Order Portal?',
    es: '¿Cuánto tiempo tarda la certificación ISO con ISO Order Portal?',
    pt: 'Quanto tempo demora a certificação ISO através da ISO Order Portal?',
    it: 'Quanto tempo richiede la certificazione ISO con ISO Order Portal?'
  },
  'Once your documents are submitted and reviewed, initial certification can move as fast as 3-7 business days, depending on the standard and accreditation body selected.': {
    fr: 'Une fois vos documents soumis et examinés, la certification initiale peut se faire en seulement 3 à 7 jours ouvrés, selon la norme et l’organisme d’accréditation choisis.',
    de: 'Sobald Ihre Dokumente eingereicht und geprüft sind, kann die Erstzertifizierung je nach gewählter Norm und Akkreditierungsstelle bereits in 3–7 Werktagen erfolgen.',
    es: 'Una vez que se presentan y revisan tus documentos, la certificación inicial puede completarse en tan solo 3-7 días hábiles, según la norma y el organismo de acreditación elegidos.',
    pt: 'Assim que os seus documentos forem submetidos e revistos, a certificação inicial pode demorar apenas 3-7 dias úteis, dependendo da norma e do organismo de acreditação selecionados.',
    it: 'Una volta inviati e verificati i documenti, la certificazione iniziale può richiedere solo 3-7 giorni lavorativi, a seconda dello standard e dell’ente di accreditamento scelti.'
  },
  'Is my ISO certificate internationally recognized?': {
    fr: 'Mon certificat ISO est-il reconnu à l’international ?',
    de: 'Wird mein ISO-Zertifikat international anerkannt?',
    es: '¿Mi certificado ISO está reconocido internacionalmente?',
    pt: 'O meu certificado ISO é reconhecido internacionalmente?',
    it: 'Il mio certificato ISO è riconosciuto a livello internazionale?'
  },
  'Yes. Certificates issued through an accredited body are internationally recognized and instantly verifiable through IAF CertSearch, the official global registry.': {
    fr: 'Oui. Les certificats délivrés par un organisme accrédité sont reconnus à l’international et instantanément vérifiables via IAF CertSearch, le registre mondial officiel.',
    de: 'Ja. Zertifikate, die von einer akkreditierten Stelle ausgestellt werden, sind international anerkannt und sofort über das offizielle globale Register IAF CertSearch überprüfbar.',
    es: 'Sí. Los certificados emitidos por un organismo acreditado están reconocidos internacionalmente y pueden verificarse al instante en IAF CertSearch, el registro oficial global.',
    pt: 'Sim. Os certificados emitidos por um organismo acreditado são reconhecidos internacionalmente e podem ser verificados instantaneamente no IAF CertSearch, o registo oficial global.',
    it: 'Sì. I certificati rilasciati da un ente accreditato sono riconosciuti a livello internazionale e verificabili all’istante su IAF CertSearch, il registro globale ufficiale.'
  },
  'How does billing and renewal work?': {
    fr: 'Comment fonctionnent la facturation et le renouvellement ?',
    de: 'Wie funktionieren Abrechnung und Verlängerung?',
    es: '¿Cómo funciona la facturación y la renovación?',
    pt: 'Como funciona a faturação e a renovação?',
    it: 'Come funzionano la fatturazione e il rinnovo?'
  },
  'Certification is a subscription: you choose a 1-year or 3-year term, it renews automatically on your card, and you can cancel anytime from your dashboard.': {
    fr: 'La certification est un abonnement : vous choisissez une durée de 1 ou 3 ans, il se renouvelle automatiquement sur votre carte, et vous pouvez annuler à tout moment depuis votre tableau de bord.',
    de: 'Die Zertifizierung ist ein Abonnement: Sie wählen eine Laufzeit von 1 oder 3 Jahren, es verlängert sich automatisch über Ihre Karte, und Sie können jederzeit über Ihr Dashboard kündigen.',
    es: 'La certificación es una suscripción: eliges un plazo de 1 o 3 años, se renueva automáticamente con tu tarjeta y puedes cancelarla en cualquier momento desde tu panel.',
    pt: 'A certificação é uma subscrição: escolhe um prazo de 1 ou 3 anos, renova-se automaticamente no seu cartão e pode cancelar a qualquer momento a partir do seu painel.',
    it: 'La certificazione è un abbonamento: scegli una durata di 1 o 3 anni, si rinnova automaticamente sulla tua carta e puoi annullarlo in qualsiasi momento dalla tua dashboard.'
  },
  'Which accreditation bodies can I choose from?': {
    fr: 'Parmi quels organismes d’accréditation puis-je choisir ?',
    de: 'Aus welchen Akkreditierungsstellen kann ich wählen?',
    es: '¿Entre qué organismos de acreditación puedo elegir?',
    pt: 'Entre que organismos de acreditação posso escolher?',
    it: 'Tra quali enti di accreditamento posso scegliere?'
  },
  'UAF and IAS are available online at fixed, transparent prices. Other globally recognized accreditation bodies are available on request — contact us for a custom quote.': {
    fr: 'UAF et IAS sont disponibles en ligne à des prix fixes et transparents. D’autres organismes d’accréditation reconnus mondialement sont disponibles sur demande — contactez-nous pour un devis personnalisé.',
    de: 'UAF und IAS sind online zu festen, transparenten Preisen verfügbar. Weitere weltweit anerkannte Akkreditierungsstellen sind auf Anfrage erhältlich — kontaktieren Sie uns für ein individuelles Angebot.',
    es: 'UAF e IAS están disponibles en línea a precios fijos y transparentes. Otros organismos de acreditación reconocidos mundialmente están disponibles bajo solicitud: contáctanos para un presupuesto personalizado.',
    pt: 'A UAF e a IAS estão disponíveis online a preços fixos e transparentes. Outros organismos de acreditação reconhecidos mundialmente estão disponíveis mediante pedido — contacte-nos para um orçamento personalizado.',
    it: 'UAF e IAS sono disponibili online a prezzi fissi e trasparenti. Altri enti di accreditamento riconosciuti a livello globale sono disponibili su richiesta — contattaci per un preventivo personalizzato.'
  },
  'Can my clients verify that my certificate is genuine?': {
    fr: 'Mes clients peuvent-ils vérifier que mon certificat est authentique ?',
    de: 'Können meine Kunden überprüfen, ob mein Zertifikat echt ist?',
    es: '¿Pueden mis clientes verificar que mi certificado es auténtico?',
    pt: 'Os meus clientes podem verificar se o meu certificado é genuíno?',
    it: 'I miei clienti possono verificare che il mio certificato sia autentico?'
  },
  'Yes. Every certificate we issue is listed on IAF CertSearch, so anyone can confirm it is genuine in seconds — no need to contact us directly.': {
    fr: 'Oui. Chaque certificat que nous délivrons est répertorié sur IAF CertSearch, ainsi n’importe qui peut confirmer son authenticité en quelques secondes — sans avoir à nous contacter directement.',
    de: 'Ja. Jedes von uns ausgestellte Zertifikat ist in IAF CertSearch gelistet, sodass jeder die Echtheit in Sekunden bestätigen kann — ohne uns direkt kontaktieren zu müssen.',
    es: 'Sí. Cada certificado que emitimos figura en IAF CertSearch, por lo que cualquiera puede confirmar que es auténtico en segundos, sin necesidad de contactarnos directamente.',
    pt: 'Sim. Cada certificado que emitimos está listado no IAF CertSearch, para que qualquer pessoa possa confirmar que é genuíno em segundos — sem necessidade de nos contactar diretamente.',
    it: 'Sì. Ogni certificato che rilasciamo è elencato su IAF CertSearch, quindi chiunque può confermarne l’autenticità in pochi secondi, senza doverci contattare direttamente.'
  },

  // Lead Auditor training standard titles
  'Quality Management': { fr: 'Management de la qualité', de: 'Qualitätsmanagement', es: 'Gestión de calidad', pt: 'Gestão da qualidade', it: 'Gestione della qualità' },
  'Health & Safety': { fr: 'Santé et sécurité', de: 'Gesundheit & Sicherheit', es: 'Salud y seguridad', pt: 'Saúde e segurança', it: 'Salute e sicurezza' },
  'Food Safety': { fr: 'Sécurité alimentaire', de: 'Lebensmittelsicherheit', es: 'Seguridad alimentaria', pt: 'Segurança alimentar', it: 'Sicurezza alimentare' },
  'Business Continuity': { fr: 'Continuité d’activité', de: 'Betriebskontinuität', es: 'Continuidad del negocio', pt: 'Continuidade de negócio', it: 'Continuità operativa' },
  'Information Security': { fr: 'Sécurité de l’information', de: 'Informationssicherheit', es: 'Seguridad de la información', pt: 'Segurança da informação', it: 'Sicurezza delle informazioni' },
  'Medical Devices': { fr: 'Dispositifs médicaux', de: 'Medizinprodukte', es: 'Dispositivos médicos', pt: 'Dispositivos médicos', it: 'Dispositivi medici' }
};
