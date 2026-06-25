const API_BASE = window.location.protocol === "file:" ? "http://127.0.0.1:8000" : "";

const MAX_HISTORY_MESSAGES = 80;
const MAX_CONTEXT_MESSAGES = 12;
const MAX_SESSIONS = 18;
const SHARE_HASH_PREFIX = "#share=";
const APP_VERSION = "1.0.0";

const form = document.querySelector("#plannerForm");
const messageInput = document.querySelector("#messageInput");
const budgetInput = document.querySelector("#budgetInput");
const daysInput = document.querySelector("#daysInput");
const travelersInput = document.querySelector("#travelersInput");
const sustainabilityInput = document.querySelector("#sustainabilityInput");
const sustainabilityValue = document.querySelector("#sustainabilityValue");
const chatMessages = document.querySelector("#chatMessages");
const statusChip = document.querySelector("#statusChip");
const routeSignal = document.querySelector("#routeSignal");
const weatherSignal = document.querySelector("#weatherSignal");
const locationSignal = document.querySelector("#locationSignal");
const submitButton = document.querySelector("#submitButton");
const newChatButton = document.querySelector("#newChatButton");
const clearHistoryButton = document.querySelector("#clearHistoryButton");
const resetSettingsButton = document.querySelector("#resetSettingsButton");
const apiDocsLink = document.querySelector("#apiDocsLink");
const openSidebarButton = document.querySelector("#openSidebarButton");
const closeSidebarButton = document.querySelector("#closeSidebarButton");
const addContextButton = document.querySelector("#addContextButton");
const attachmentTray = document.querySelector("#attachmentTray");
const addFilesMenu = document.querySelector("#addFilesMenu");
const chooseFilesButton = document.querySelector("#chooseFilesButton");
const fileInput = document.querySelector("#fileInput");
const voiceButton = document.querySelector("#voiceButton");
const voiceStatus = document.querySelector("#voiceStatus");
const recentsToggleButton = document.querySelector("#recentsToggleButton");
const recentsList = document.querySelector("#recentsList");
const recentsCount = document.querySelector("#recentsCount");
const languageToggleButton = document.querySelector("#languageToggleButton");
const languageMenu = document.querySelector("#languageMenu");
const languageCode = document.querySelector("#languageCode");
const themeToggleButton = document.querySelector("#themeToggleButton");
const themeColorMeta = document.querySelector('meta[name="theme-color"]');
const shareButton = document.querySelector("#shareButton");
const shareOverlay = document.querySelector("#shareOverlay");
const shareLinkInput = document.querySelector("#shareLinkInput");
const copyShareButton = document.querySelector("#copyShareButton");
const closeShareButton = document.querySelector("#closeShareButton");
const renameOverlay = document.querySelector("#renameOverlay");
const renameForm = document.querySelector("#renameForm");
const renameInput = document.querySelector("#renameInput");
const closeRenameButton = document.querySelector("#closeRenameButton");
const cancelRenameButton = document.querySelector("#cancelRenameButton");
const styleButtons = Array.from(document.querySelectorAll("#styleControl button"));
const stepperButtons = Array.from(document.querySelectorAll("[data-stepper-target]"));
const appVersionLabel = document.querySelector("#appVersionLabel");

const sidebarStateKey = "eco-travel-planner-sidebar-collapsed";
const historyKey = "eco-travel-planner-history";
const sessionsKey = "eco-travel-planner-sessions";
const currentSessionKey = "eco-travel-planner-current-session-id";
const languageKey = "eco-travel-planner-language";
const themeKey = "eco-travel-planner-theme";
const themeColors = {
  dark: "#0b0f14",
  light: "#f8fafc",
};
const LANGUAGE_OPTIONS = [
  { value: "English", label: "English", nativeLabel: "English", code: "en", short: "EN", dir: "ltr" },
  { value: "Turkish", label: "Turkish", nativeLabel: "Türkçe", code: "tr", short: "TR", dir: "ltr" },
  { value: "Arabic", label: "Arabic", nativeLabel: "العربية", code: "ar", short: "AR", dir: "rtl" },
];
const LANGUAGE_VALUES = LANGUAGE_OPTIONS.map((language) => language.value);
const DEFAULT_TRIP_SETTINGS = {
  language: "English",
  budget: "Smart value",
  travelStyle: "Balanced",
  days: 5,
  travelers: 2,
  sustainability: 4,
};

const I18N = {
  English: {
    topActions: "Display and sharing controls",
    appInformation: "App information",
    sidebarCredit: "Designed & Built by Nour Asal",
    changeLanguage: "Change language",
    chooseLanguage: "Choose language",
    selectedLanguage: "{language} selected",
    toggleTheme: "Toggle theme",
    switchToLightMode: "Switch to light mode",
    switchToDarkMode: "Switch to dark mode",
    shareConversation: "Share conversation",
    share: "Share",
    openSidebar: "Open sidebar",
    closeSidebar: "Close sidebar",
    newTrip: "New trip",
    clearChat: "Clear chat",
    clearCurrentChat: "Clear current chat",
    recentChats: "Recent chats",
    recents: "Recents",
    noRecentChats: "No recent chats yet.",
    tripSettings: "Trip settings",
    resetSettings: "Reset",
    budget: "Budget",
    budgetEconomy: "Economy",
    budgetSmartValue: "Smart value",
    budgetPremium: "Premium",
    budgetLuxury: "Luxury",
    travelStyle: "Travel style",
    styleBalanced: "Balanced",
    styleRelaxed: "Relaxed",
    styleAdventure: "Adventure",
    styleFamily: "Family",
    styleBusiness: "Business",
    days: "Days",
    decreaseDays: "Decrease days",
    increaseDays: "Increase days",
    travelers: "Travelers",
    decreaseTravelers: "Decrease travelers",
    increaseTravelers: "Increase travelers",
    traveler: "traveler",
    travelersLower: "travelers",
    sustainability: "Sustainability",
    lowerImpact: "Lower",
    higherImpact: "Higher",
    message: "Message",
    askAnything: "Ask anything...",
    addFiles: "Add photos & files",
    addFilesLong: "Add photos and files",
    startVoiceInput: "Start voice input",
    stopVoiceInput: "Stop voice input",
    sendMessage: "Send message",
    whereNext: "Where should we go next?",
    welcomeText:
      "Ask for a route, full itinerary, hotel strategy, weather-aware packing list, or a lower-carbon travel plan. The agent will use your trip settings from the sidebar.",
    promptTrain: "Compare train vs flight from Paris to Amsterdam for a weekend.",
    promptFamily: "Plan a family-friendly eco trip in Norway for 7 days.",
    promptBudget: "Find a low-budget route through Turkey using buses and trains.",
    shareChat: "Share chat",
    createConversationLink: "Create a conversation link",
    closeShareDialog: "Close share dialog",
    shareNote:
      "This creates a short share link for the current conversation. Anyone with the link can view that snapshot.",
    conversationLink: "Conversation link",
    copyLink: "Copy link",
    copy: "Copy",
    copied: "Copied",
    creatingShareLink: "Creating share link...",
    shareLinkCopied: "Share link copied",
    sharedSuccessfully: "Shared successfully",
    couldNotCopyShareLink: "Could not copy share link",
    shareCreateFailed: "Could not create a share link. Please try again.",
    shareNoContent: "Start a trip conversation before sharing.",
    saveAsPdf: "Save as PDF",
    print: "Print",
    shareNotSupportedCopied: "Share not supported, copied instead.",
    couldNotCopy: "Could not copy.",
    generatedByEcoTravelPlanner: "Generated by Eco Travel Planner",
    generatedDate: "Generated date",
    language: "Language",
    rename: "Rename",
    renameChat: "Rename chat",
    closeRenameDialog: "Close rename dialog",
    chatName: "Chat name",
    cancel: "Cancel",
    save: "Save",
    delete: "Delete",
    deleteChat: "Delete chat",
    optionsFor: "Options for {title}",
    untitledTrip: "Untitled trip",
    pinChat: "Pin chat",
    unpinChat: "Unpin chat",
    pinned: "Pinned",
    copyMessage: "Copy message",
    editMessage: "Edit message",
    removeAttachment: "Remove {name}",
    ready: "Ready",
    thinking: "Thinking",
    waitingDestination: "Waiting for destination",
    weatherAvailable: "Weather available when detected",
    publicGeodata: "Public geodata enabled",
    checkingWeather: "Checking weather context",
    searchingGeodata: "Searching public geodata",
    unavailable: "Unavailable",
    noLiveWeather: "No live weather used",
    noLocationContext: "No location context",
    locationMatches: "{count} location matches",
    routeSignal: "{days} days, {travelers} {travelerLabel}",
    loadingTripPlan: "Building your eco trip plan",
    preparingItinerary: "Preparing your itinerary",
    loadingTripSummary: "{days} {dayLabel} | {travelers} {travelerLabel}",
    daySingular: "day",
    dayPlural: "days",
    readingSettings: "Reading your trip settings",
    checkingContext: "Checking live travel context",
    draftingItinerary: "Drafting a practical itinerary",
    backendUnavailable: "Backend unavailable",
    backendUnavailableMessage:
      "Could not reach the FastAPI backend. Start the local server at http://127.0.0.1:8000 and try again.",
    requestFailed: "Request failed",
    requestFailedMessage: "Something went wrong while generating the plan.",
    requestIssue: "Request issue",
    requestIssueMessage: "The backend could not validate this request. {detail}",
    backendIssue: "Backend issue",
    aiApiIssue: "AI API issue",
    fallbackPlanMessage: "I could not generate a trip plan this time.",
    weatherApi: "Weather API",
    placesService: "Places service",
    travelContext: "Travel context",
    weatherIn: "Weather in {city}",
    destination: "the destination",
    humidity: "humidity",
    wind: "wind",
    weatherAndServiceNotices: "Weather and service notices",
    placesAndActivities: "Places and activities",
    localPlace: "Local place",
    tripOverview: "Trip overview",
    tripPlanAria: "Structured travel plan",
    travelPlan: "Travel plan",
    sectionCount: "{count} section",
    sectionCountPlural: "{count} sections",
    overview: "Overview",
    dayPlan: "Day plan",
    liveContext: "Live context",
    places: "Places",
    tips: "Tips",
    sectionSummary: "Summary",
    sectionRouteTransport: "Route and transport",
    sectionStayStrategy: "Stay strategy",
    sectionDailyFlow: "Daily flow",
    sectionBudget: "Budget",
    sectionWeather: "Weather and packing",
    sectionSustainability: "Sustainability notes",
    sectionSmartNextSteps: "Smart next steps",
    sectionPacking: "Packing notes",
    sectionNotes: "Notes",
    recent: "Recent",
    justNow: "Just now",
    minAgo: "{count} min ago",
    hrAgo: "{count} hr ago",
    dAgo: "{count} d ago",
    voiceUnsupported: "Voice input is not supported by this browser.",
    voiceStopped: "Voice input stopped",
    listening: "Listening",
    voiceInputError: "Voice input error: {error}",
    voiceAlreadyStarting: "Voice input is already starting.",
    attachmentPrompt:
      "Analyze the attached travel photo or file. Extract any ticket, destination, city, country, date, route, and timing details you can find, then suggest the best places to visit and practical next steps for that destination.",
    attachedFiles: "Attached files: {names}",
    fileTooLarge: "{name} is larger than 6 MB. Please choose a smaller image or text file.",
    unsupportedFile: "{name} is not supported yet. Please add an image, TXT, MD, or CSV file.",
    addTravelFile: "Ask about the attached travel file...",
    exportPdf: "Export PDF",
  },
  Turkish: {
    topActions: "Görünüm ve paylaşım kontrolleri",
    appInformation: "Uygulama bilgisi",
    sidebarCredit: "Tasarlandı ve geliştirildi: Nour Asal",
    changeLanguage: "Dili değiştir",
    chooseLanguage: "Dil seç",
    selectedLanguage: "{language} seçildi",
    toggleTheme: "Temayı değiştir",
    switchToLightMode: "Açık moda geç",
    switchToDarkMode: "Koyu moda geç",
    shareConversation: "Konuşmayı paylaş",
    share: "Paylaş",
    openSidebar: "Yan paneli aç",
    closeSidebar: "Yan paneli kapat",
    newTrip: "Yeni gezi",
    clearChat: "Sohbeti temizle",
    clearCurrentChat: "Geçerli sohbeti temizle",
    recentChats: "Son sohbetler",
    recents: "Sonlar",
    noRecentChats: "Henüz kayıtlı sohbet yok.",
    tripSettings: "Gezi ayarları",
    resetSettings: "Sıfırla",
    budget: "Bütçe",
    budgetEconomy: "Ekonomik",
    budgetSmartValue: "Dengeli değer",
    budgetPremium: "Premium",
    budgetLuxury: "Lüks",
    travelStyle: "Seyahat tarzı",
    styleBalanced: "Dengeli",
    styleRelaxed: "Rahat",
    styleAdventure: "Macera",
    styleFamily: "Aile",
    styleBusiness: "İş",
    days: "Gün",
    decreaseDays: "Gün sayısını azalt",
    increaseDays: "Gün sayısını artır",
    travelers: "Yolcular",
    decreaseTravelers: "Yolcu sayısını azalt",
    increaseTravelers: "Yolcu sayısını artır",
    traveler: "yolcu",
    travelersLower: "yolcu",
    sustainability: "Sürdürülebilirlik",
    lowerImpact: "Düşük",
    higherImpact: "Yüksek",
    message: "Mesaj",
    askAnything: "Her şeyi sor...",
    addFiles: "Fotoğraf ve dosya ekle",
    addFilesLong: "Fotoğraf ve dosya ekle",
    startVoiceInput: "Sesli girişi başlat",
    stopVoiceInput: "Sesli girişi durdur",
    sendMessage: "Mesaj gönder",
    whereNext: "Sırada nereye gidelim?",
    welcomeText:
      "Rota, tam program, konaklama stratejisi, hava durumuna göre bavul listesi veya daha düşük karbonlu bir seyahat planı iste. Ajan yan paneldeki gezi ayarlarını kullanır.",
    promptTrain: "Paris-Amsterdam hafta sonu için tren ve uçuşu karşılaştır.",
    promptFamily: "Norveç'te 7 günlük aile dostu eko gezi planla.",
    promptBudget: "Türkiye'de otobüs ve trenlerle düşük bütçeli bir rota bul.",
    shareChat: "Sohbeti paylaş",
    createConversationLink: "Konuşma bağlantısı oluştur",
    closeShareDialog: "Paylaşım penceresini kapat",
    shareNote:
      "Bu, geçerli konuşma için kısa bir paylaşım bağlantısı oluşturur. Bağlantıya sahip olan herkes bu anlık görüntüyü görebilir.",
    conversationLink: "Konuşma bağlantısı",
    copyLink: "Bağlantıyı kopyala",
    copy: "Kopyala",
    copied: "Kopyalandı",
    creatingShareLink: "Paylaşım bağlantısı oluşturuluyor...",
    shareLinkCopied: "Paylaşım bağlantısı kopyalandı",
    sharedSuccessfully: "Başarıyla paylaşıldı",
    couldNotCopyShareLink: "Paylaşım bağlantısı kopyalanamadı",
    shareCreateFailed: "Paylaşım bağlantısı oluşturulamadı. Lütfen tekrar deneyin.",
    shareNoContent: "Paylaşmadan önce bir gezi sohbeti başlat.",
    saveAsPdf: "PDF olarak kaydet",
    print: "Yazdır",
    shareNotSupportedCopied: "Paylaşım desteklenmiyor, bunun yerine kopyalandı.",
    couldNotCopy: "Kopyalanamadı.",
    generatedByEcoTravelPlanner: "Eco Travel Planner tarafından oluşturuldu",
    generatedDate: "Oluşturulma tarihi",
    language: "Dil",
    rename: "Yeniden adlandır",
    renameChat: "Sohbeti yeniden adlandır",
    closeRenameDialog: "Yeniden adlandırma penceresini kapat",
    chatName: "Sohbet adı",
    cancel: "İptal",
    save: "Kaydet",
    delete: "Sil",
    deleteChat: "Sohbeti sil",
    optionsFor: "{title} seçenekleri",
    untitledTrip: "Adsız gezi",
    pinChat: "Sohbeti sabitle",
    unpinChat: "Sabitlemeyi kaldır",
    pinned: "Sabit",
    copyMessage: "Mesajı kopyala",
    editMessage: "Mesajı düzenle",
    removeAttachment: "{name} ekini kaldır",
    ready: "Hazır",
    thinking: "Düşünüyor",
    waitingDestination: "Varış noktası bekleniyor",
    weatherAvailable: "Algılanınca hava durumu gelir",
    publicGeodata: "Herkese açık konum verisi etkin",
    checkingWeather: "Hava durumu bağlamı kontrol ediliyor",
    searchingGeodata: "Herkese açık konum verisi aranıyor",
    unavailable: "Kullanılamıyor",
    noLiveWeather: "Canlı hava durumu kullanılmadı",
    noLocationContext: "Konum bağlamı yok",
    locationMatches: "{count} konum eşleşmesi",
    routeSignal: "{days} gün, {travelers} {travelerLabel}",
    loadingTripPlan: "Eko gezi planın hazırlanıyor",
    preparingItinerary: "Program hazırlanıyor",
    loadingTripSummary: "{days} {dayLabel} | {travelers} {travelerLabel}",
    daySingular: "gün",
    dayPlural: "gün",
    readingSettings: "Gezi ayarların okunuyor",
    checkingContext: "Canlı seyahat bağlamı kontrol ediliyor",
    draftingItinerary: "Pratik program taslağı hazırlanıyor",
    backendUnavailable: "Backend'e ulaşılamıyor",
    backendUnavailableMessage:
      "FastAPI backend'e ulaşılamadı. Yerel sunucuyu http://127.0.0.1:8000 adresinde başlatıp tekrar dene.",
    requestFailed: "İstek başarısız",
    requestFailedMessage: "Plan oluşturulurken bir sorun oluştu.",
    requestIssue: "İstek sorunu",
    requestIssueMessage: "Backend bu isteği doğrulayamadı. {detail}",
    backendIssue: "Backend sorunu",
    aiApiIssue: "AI API sorunu",
    fallbackPlanMessage: "Bu sefer gezi planı oluşturamadım.",
    weatherApi: "Hava durumu API'si",
    placesService: "Yer servisi",
    travelContext: "Seyahat bağlamı",
    weatherIn: "{city} hava durumu",
    destination: "varış noktası",
    humidity: "nem",
    wind: "rüzgar",
    weatherAndServiceNotices: "Hava durumu ve servis notları",
    placesAndActivities: "Yerler ve aktiviteler",
    localPlace: "Yerel nokta",
    tripOverview: "Gezi özeti",
    tripPlanAria: "Yapılandırılmış gezi planı",
    travelPlan: "Gezi planı",
    sectionCount: "{count} bölüm",
    sectionCountPlural: "{count} bölüm",
    overview: "Özet",
    dayPlan: "Gün planı",
    liveContext: "Canlı bağlam",
    places: "Yerler",
    tips: "İpuçları",
    sectionSummary: "Özet",
    sectionRouteTransport: "Rota ve ulaşım",
    sectionStayStrategy: "Konaklama stratejisi",
    sectionDailyFlow: "Günlük akış",
    sectionBudget: "Bütçe",
    sectionWeather: "Hava durumu ve hazırlık",
    sectionSustainability: "Sürdürülebilirlik notları",
    sectionSmartNextSteps: "Akıllı sonraki adımlar",
    sectionPacking: "Hazırlık notları",
    sectionNotes: "Notlar",
    recent: "Yakın zamanda",
    justNow: "Az önce",
    minAgo: "{count} dk önce",
    hrAgo: "{count} sa önce",
    dAgo: "{count} gün önce",
    voiceUnsupported: "Bu tarayıcı sesli girişi desteklemiyor.",
    voiceStopped: "Sesli giriş durdu",
    listening: "Dinleniyor",
    voiceInputError: "Sesli giriş hatası: {error}",
    voiceAlreadyStarting: "Sesli giriş zaten başlıyor.",
    attachmentPrompt:
      "Eklenen seyahat fotoğrafını veya dosyasını analiz et. Bilet, varış noktası, şehir, ülke, tarih, rota ve saat bilgilerini çıkar; ardından o destinasyon için gezilecek en iyi yerleri ve pratik sonraki adımları öner.",
    attachedFiles: "Eklenen dosyalar: {names}",
    fileTooLarge: "{name} 6 MB'tan büyük. Lütfen daha küçük bir görsel veya metin dosyası seç.",
    unsupportedFile: "{name} henüz desteklenmiyor. Lütfen görsel, TXT, MD veya CSV dosyası ekle.",
    addTravelFile: "Eklenen seyahat dosyası hakkında sor...",
    exportPdf: "PDF dışa aktar",
  },
  Arabic: {
    topActions: "عناصر العرض والمشاركة",
    appInformation: "معلومات التطبيق",
    sidebarCredit: "تم التصميم والتطوير بواسطة Nour Asal",
    changeLanguage: "تغيير اللغة",
    chooseLanguage: "اختر اللغة",
    selectedLanguage: "تم اختيار {language}",
    toggleTheme: "تغيير النمط",
    switchToLightMode: "التبديل إلى النمط الفاتح",
    switchToDarkMode: "التبديل إلى النمط الداكن",
    shareConversation: "مشاركة المحادثة",
    share: "مشاركة",
    openSidebar: "فتح الشريط الجانبي",
    closeSidebar: "إغلاق الشريط الجانبي",
    newTrip: "رحلة جديدة",
    clearChat: "مسح المحادثة",
    clearCurrentChat: "مسح المحادثة الحالية",
    recentChats: "المحادثات الأخيرة",
    recents: "الأخيرة",
    noRecentChats: "لا توجد محادثات محفوظة بعد.",
    tripSettings: "إعدادات الرحلة",
    resetSettings: "إعادة ضبط",
    budget: "الميزانية",
    budgetEconomy: "اقتصادية",
    budgetSmartValue: "قيمة ذكية",
    budgetPremium: "مميزة",
    budgetLuxury: "فاخرة",
    travelStyle: "نمط السفر",
    styleBalanced: "متوازن",
    styleRelaxed: "هادئ",
    styleAdventure: "مغامرة",
    styleFamily: "عائلي",
    styleBusiness: "أعمال",
    days: "الأيام",
    decreaseDays: "تقليل عدد الأيام",
    increaseDays: "زيادة عدد الأيام",
    travelers: "المسافرون",
    decreaseTravelers: "تقليل عدد المسافرين",
    increaseTravelers: "زيادة عدد المسافرين",
    traveler: "مسافر",
    travelersLower: "مسافرون",
    sustainability: "الاستدامة",
    lowerImpact: "أقل",
    higherImpact: "أعلى",
    message: "الرسالة",
    askAnything: "اسأل أي شيء...",
    addFiles: "إضافة صور وملفات",
    addFilesLong: "إضافة صور وملفات",
    startVoiceInput: "بدء الإدخال الصوتي",
    stopVoiceInput: "إيقاف الإدخال الصوتي",
    sendMessage: "إرسال الرسالة",
    whereNext: "إلى أين نذهب بعد ذلك؟",
    welcomeText:
      "اطلب مسارا، برنامجا كاملا، استراتيجية إقامة، قائمة تجهيزات حسب الطقس، أو خطة سفر أقل انبعاثا للكربون. سيستخدم المساعد إعدادات الرحلة من الشريط الجانبي.",
    promptTrain: "قارن بين القطار والطائرة من باريس إلى أمستردام لعطلة نهاية الأسبوع.",
    promptFamily: "خطط لرحلة بيئية مناسبة للعائلة في النرويج لمدة 7 أيام.",
    promptBudget: "ابحث عن مسار منخفض التكلفة داخل تركيا باستخدام الحافلات والقطارات.",
    shareChat: "مشاركة المحادثة",
    createConversationLink: "إنشاء رابط للمحادثة",
    closeShareDialog: "إغلاق نافذة المشاركة",
    shareNote:
      "ينشئ هذا رابط مشاركة قصيرا للمحادثة الحالية. يمكن لأي شخص لديه الرابط رؤية هذه اللقطة.",
    conversationLink: "رابط المحادثة",
    copyLink: "نسخ الرابط",
    copy: "نسخ",
    copied: "تم النسخ",
    creatingShareLink: "جار إنشاء رابط المشاركة...",
    shareLinkCopied: "تم نسخ رابط المشاركة",
    sharedSuccessfully: "تمت المشاركة بنجاح",
    couldNotCopyShareLink: "تعذر نسخ رابط المشاركة",
    shareCreateFailed: "تعذر إنشاء رابط المشاركة. يرجى المحاولة مرة أخرى.",
    shareNoContent: "ابدأ محادثة رحلة قبل المشاركة.",
    saveAsPdf: "حفظ كملف PDF",
    print: "طباعة",
    shareNotSupportedCopied: "المشاركة غير مدعومة، تم النسخ بدلا من ذلك.",
    couldNotCopy: "تعذر النسخ.",
    generatedByEcoTravelPlanner: "تم الإنشاء بواسطة Eco Travel Planner",
    generatedDate: "تاريخ الإنشاء",
    language: "اللغة",
    rename: "إعادة تسمية",
    renameChat: "إعادة تسمية المحادثة",
    closeRenameDialog: "إغلاق نافذة إعادة التسمية",
    chatName: "اسم المحادثة",
    cancel: "إلغاء",
    save: "حفظ",
    delete: "حذف",
    deleteChat: "حذف المحادثة",
    optionsFor: "خيارات {title}",
    untitledTrip: "رحلة بلا عنوان",
    pinChat: "تثبيت المحادثة",
    unpinChat: "إلغاء التثبيت",
    pinned: "مثبتة",
    copyMessage: "نسخ الرسالة",
    editMessage: "تعديل الرسالة",
    removeAttachment: "إزالة {name}",
    ready: "جاهز",
    thinking: "يفكر",
    waitingDestination: "بانتظار الوجهة",
    weatherAvailable: "يتوفر الطقس عند اكتشاف الوجهة",
    publicGeodata: "بيانات المواقع العامة مفعلة",
    checkingWeather: "جار فحص سياق الطقس",
    searchingGeodata: "جار البحث في بيانات المواقع العامة",
    unavailable: "غير متاح",
    noLiveWeather: "لم يستخدم طقس مباشر",
    noLocationContext: "لا يوجد سياق موقع",
    locationMatches: "{count} نتيجة موقع",
    routeSignal: "{days} يوم، {travelers} {travelerLabel}",
    loadingTripPlan: "جار إعداد خطة رحلتك البيئية",
    preparingItinerary: "جار إعداد البرنامج",
    loadingTripSummary: "{days} {dayLabel} | {travelers} {travelerLabel}",
    daySingular: "يوم",
    dayPlural: "أيام",
    readingSettings: "جار قراءة إعدادات الرحلة",
    checkingContext: "جار فحص سياق السفر المباشر",
    draftingItinerary: "جار صياغة برنامج عملي",
    backendUnavailable: "الخادم الخلفي غير متاح",
    backendUnavailableMessage:
      "تعذر الوصول إلى FastAPI. شغل الخادم المحلي على http://127.0.0.1:8000 ثم حاول مرة أخرى.",
    requestFailed: "فشل الطلب",
    requestFailedMessage: "حدث خطأ أثناء إنشاء الخطة.",
    requestIssue: "مشكلة في الطلب",
    requestIssueMessage: "تعذر على الخادم التحقق من هذا الطلب. {detail}",
    backendIssue: "مشكلة في الخادم",
    aiApiIssue: "مشكلة في واجهة الذكاء الاصطناعي",
    fallbackPlanMessage: "تعذر إنشاء خطة رحلة هذه المرة.",
    weatherApi: "واجهة الطقس",
    placesService: "خدمة الأماكن",
    travelContext: "سياق السفر",
    weatherIn: "الطقس في {city}",
    destination: "الوجهة",
    humidity: "الرطوبة",
    wind: "الرياح",
    weatherAndServiceNotices: "الطقس وتنبيهات الخدمات",
    placesAndActivities: "الأماكن والأنشطة",
    localPlace: "مكان محلي",
    tripOverview: "نظرة عامة على الرحلة",
    tripPlanAria: "خطة سفر منظمة",
    travelPlan: "خطة السفر",
    sectionCount: "{count} قسم",
    sectionCountPlural: "{count} أقسام",
    overview: "نظرة عامة",
    dayPlan: "خطة اليوم",
    liveContext: "سياق مباشر",
    places: "الأماكن",
    tips: "نصائح",
    sectionSummary: "ملخص",
    sectionRouteTransport: "المسار ووسائل النقل",
    sectionStayStrategy: "استراتيجية الإقامة",
    sectionDailyFlow: "البرنامج اليومي",
    sectionBudget: "الميزانية",
    sectionWeather: "الطقس والتجهيزات",
    sectionSustainability: "ملاحظات الاستدامة",
    sectionSmartNextSteps: "الخطوات الذكية التالية",
    sectionPacking: "ملاحظات التجهيز",
    sectionNotes: "ملاحظات",
    recent: "حديث",
    justNow: "الآن",
    minAgo: "قبل {count} دقيقة",
    hrAgo: "قبل {count} ساعة",
    dAgo: "قبل {count} يوم",
    voiceUnsupported: "هذا المتصفح لا يدعم الإدخال الصوتي.",
    voiceStopped: "توقف الإدخال الصوتي",
    listening: "جار الاستماع",
    voiceInputError: "خطأ في الإدخال الصوتي: {error}",
    voiceAlreadyStarting: "الإدخال الصوتي يبدأ بالفعل.",
    attachmentPrompt:
      "حلل صورة أو ملف السفر المرفق. استخرج أي تذكرة أو وجهة أو مدينة أو دولة أو تاريخ أو مسار أو توقيت، ثم اقترح أفضل الأماكن والخطوات العملية التالية لتلك الوجهة.",
    attachedFiles: "الملفات المرفقة: {names}",
    fileTooLarge: "{name} أكبر من 6 ميغابايت. يرجى اختيار صورة أو ملف نصي أصغر.",
    unsupportedFile: "{name} غير مدعوم حاليا. يرجى إضافة صورة أو ملف TXT أو MD أو CSV.",
    addTravelFile: "اسأل عن ملف السفر المرفق...",
    exportPdf: "تصدير PDF",
  },
};

function normalizeLanguage(language) {
  return LANGUAGE_VALUES.includes(language) ? language : DEFAULT_TRIP_SETTINGS.language;
}

function storedLanguagePreference() {
  try {
    return normalizeLanguage(localStorage.getItem(languageKey));
  } catch {
    return DEFAULT_TRIP_SETTINGS.language;
  }
}

let currentLanguage = storedLanguagePreference();

let travelStyle = "Balanced";
let history = loadHistory();
let sessions = loadSessions();
let currentSessionId = localStorage.getItem(currentSessionKey) || createSessionId();
let typingNode = null;
let recentMenu = null;
let activeMenuSessionId = null;
let renameSessionId = null;
let recognition = null;
let isListening = false;
let voiceBaseText = "";
let pendingAttachments = [];
let isApplyingSession = false;

localStorage.setItem(currentSessionKey, currentSessionId);

if (apiDocsLink && API_BASE) {
  apiDocsLink.href = `${API_BASE}/api/docs`;
}

messageInput?.setAttribute("dir", "auto");

function languageMeta(language = currentLanguage) {
  return LANGUAGE_OPTIONS.find((item) => item.value === normalizeLanguage(language)) || LANGUAGE_OPTIONS[0];
}

function t(key, replacements = {}, language = currentLanguage) {
  const dictionary = I18N[normalizeLanguage(language)] || I18N.English;
  const template = dictionary[key] ?? I18N.English[key] ?? key;

  return Object.entries(replacements).reduce(
    (value, [name, replacement]) => value.replaceAll(`{${name}}`, String(replacement)),
    template
  );
}

function translatedBudget(value, language = currentLanguage) {
  const keys = {
    Economy: "budgetEconomy",
    "Smart value": "budgetSmartValue",
    Premium: "budgetPremium",
    Luxury: "budgetLuxury",
  };
  return t(keys[value] || "budgetSmartValue", {}, language);
}

function translatedTravelStyle(value, language = currentLanguage) {
  const keys = {
    Balanced: "styleBalanced",
    Relaxed: "styleRelaxed",
    Adventure: "styleAdventure",
    Family: "styleFamily",
    Business: "styleBusiness",
  };
  return t(keys[value] || "styleBalanced", {}, language);
}

function createSessionId() {
  if (window.crypto?.randomUUID) {
    return window.crypto.randomUUID();
  }
  return `session-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function readJsonStorage(key, fallback) {
  try {
    const value = JSON.parse(localStorage.getItem(key) || "null");
    return value ?? fallback;
  } catch {
    return fallback;
  }
}

function normalizeMessages(items) {
  if (!Array.isArray(items)) return [];

  return items
    .filter((item) => item && (item.role === "user" || item.role === "assistant") && item.content)
    .map((item) => {
      const message = {
        role: item.role,
        content: String(item.content),
      };

      if (item.settings) {
        message.settings = normalizeTripSettings(item.settings);
      }

      if (item.createdAt) {
        message.createdAt = dateOrNow(item.createdAt);
      }

      return message;
    });
}

function boundedNumber(value, fallback, min, max) {
  const number = Number(value);
  if (!Number.isFinite(number)) return fallback;
  return Math.min(max, Math.max(min, Math.round(number)));
}

function normalizeTripSettings(settings = {}) {
  const language = normalizeLanguage(settings.language || currentLanguage);
  const budget = ["Economy", "Smart value", "Premium", "Luxury"].includes(settings.budget || settings.budget_level)
    ? settings.budget || settings.budget_level
    : DEFAULT_TRIP_SETTINGS.budget;
  const style = ["Balanced", "Relaxed", "Adventure", "Family", "Business"].includes(
    settings.travelStyle || settings.travel_style
  )
    ? settings.travelStyle || settings.travel_style
    : DEFAULT_TRIP_SETTINGS.travelStyle;

  return {
    language,
    budget,
    travelStyle: style,
    days: boundedNumber(settings.days, DEFAULT_TRIP_SETTINGS.days, 1, 30),
    travelers: boundedNumber(settings.travelers, DEFAULT_TRIP_SETTINGS.travelers, 1, 20),
    sustainability: boundedNumber(
      settings.sustainability ?? settings.sustainability_priority,
      DEFAULT_TRIP_SETTINGS.sustainability,
      1,
      5
    ),
  };
}

function readTripSettings() {
  return normalizeTripSettings({
    language: currentLanguage,
    budget: budgetInput.value,
    travelStyle,
    days: daysInput.value,
    travelers: travelersInput.value,
    sustainability: sustainabilityInput.value,
  });
}

function settingsEqual(a, b) {
  const left = normalizeTripSettings(a);
  const right = normalizeTripSettings(b);
  return (
    left.language === right.language &&
    left.budget === right.budget &&
    left.travelStyle === right.travelStyle &&
    left.days === right.days &&
    left.travelers === right.travelers &&
    left.sustainability === right.sustainability
  );
}

function isDefaultTripSettings(settings) {
  const normalized = normalizeTripSettings(settings);
  return settingsEqual(normalized, {
    ...DEFAULT_TRIP_SETTINGS,
    language: normalized.language,
  });
}

function applyTripSettings(settings = DEFAULT_TRIP_SETTINGS, { applyLanguage = true } = {}) {
  const nextSettings = normalizeTripSettings(settings);
  isApplyingSession = true;

  if (applyLanguage) {
    setLanguage(nextSettings.language, { persist: true, render: false, saveSettings: false });
  }
  budgetInput.value = nextSettings.budget;
  daysInput.value = String(nextSettings.days);
  travelersInput.value = String(nextSettings.travelers);
  sustainabilityInput.value = String(nextSettings.sustainability);
  sustainabilityValue.textContent = String(nextSettings.sustainability);
  travelStyle = nextSettings.travelStyle;
  styleButtons.forEach((button) => {
    button.classList.toggle("active", button.dataset.value === nextSettings.travelStyle);
  });

  if (recognition) {
    recognition.lang = speechLanguage();
  }

  isApplyingSession = false;
}

function sessionMessages(session) {
  return normalizeMessages(session?.messages || session?.history).slice(-MAX_HISTORY_MESSAGES);
}

function dateOrNow(value) {
  const time = new Date(value).getTime();
  return Number.isFinite(time) ? new Date(time).toISOString() : new Date().toISOString();
}

function findCurrentSession() {
  return sessions.find((session) => session.id === currentSessionId) || null;
}

function loadHistory() {
  return normalizeMessages(readJsonStorage(historyKey, [])).slice(-MAX_HISTORY_MESSAGES);
}

function loadSessions() {
  const stored = readJsonStorage(sessionsKey, []);
  if (!Array.isArray(stored)) return [];

  return stored
    .map((session) => {
      const messages = sessionMessages(session);
      const updatedAt = dateOrNow(session?.updatedAt || session?.createdAt);
      const createdAt = dateOrNow(session?.createdAt || updatedAt);

      return {
        id: String(session?.id || ""),
        title: Boolean(session?.renamed) && session?.title ? String(session.title) : titleFromHistory(messages),
        createdAt,
        updatedAt,
        pinned: Boolean(session?.pinned),
        renamed: Boolean(session?.renamed),
        keepEmpty: Boolean(session?.keepEmpty),
        settings: normalizeTripSettings(session?.settings),
        messages,
      };
    })
    .filter((session) => session.id && shouldKeepSession(session))
    .sort(sortSessions)
    .slice(0, MAX_SESSIONS);
}

function sortSessions(a, b) {
  if (a.pinned !== b.pinned) return Number(b.pinned) - Number(a.pinned);
  return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
}

function writeHistoryOnly() {
  history = history.slice(-MAX_HISTORY_MESSAGES);
  localStorage.setItem(historyKey, JSON.stringify(history));
}

function shouldKeepSession(session) {
  return (
    sessionMessages(session).length > 0 ||
    Boolean(session?.keepEmpty) ||
    Boolean(session?.renamed) ||
    !isDefaultTripSettings(session?.settings)
  );
}

function saveSessions() {
  sessions = sessions
    .map((session) => ({
      ...session,
      settings: normalizeTripSettings(session.settings),
      messages: sessionMessages(session),
    }))
    .filter((session) => session.id && shouldKeepSession(session))
    .sort(sortSessions)
    .slice(0, MAX_SESSIONS);
  localStorage.setItem(sessionsKey, JSON.stringify(sessions));
}

function titleFromHistory(items) {
  const firstUserMessage = normalizeMessages(items).find((item) => item.role === "user")?.content;
  if (!firstUserMessage) return t("newTrip");

  const compact = firstUserMessage
    .replace(/Attached files:.*/gis, "")
    .replace(/[#*_>`~-]/g, "")
    .replace(/\s+/g, " ")
    .trim();
  const title = compact || t("newTrip");
  return title.length > 42 ? `${title.slice(0, 39).trim()}...` : title;
}

function saveCurrentSession({ touch = true, force = false, keepEmpty = false } = {}) {
  const existing = findCurrentSession();
  const settings = readTripSettings();

  if (!force && !existing && !history.length && isDefaultTripSettings(settings)) return;

  const session = {
    id: currentSessionId,
    title: existing?.renamed ? existing.title : titleFromHistory(history),
    createdAt: existing?.createdAt || new Date().toISOString(),
    updatedAt: touch ? new Date().toISOString() : existing?.updatedAt || new Date().toISOString(),
    pinned: Boolean(existing?.pinned),
    renamed: Boolean(existing?.renamed),
    keepEmpty: keepEmpty || Boolean(existing?.keepEmpty),
    settings,
    messages: history.slice(-MAX_HISTORY_MESSAGES),
  };

  sessions = [session, ...sessions.filter((item) => item.id !== currentSessionId)];
  saveSessions();
}

function saveHistory() {
  writeHistoryOnly();
  saveCurrentSession();
  renderRecents();
}

function bootstrapSessions() {
  const activeSession = findCurrentSession();

  if (activeSession) {
    history = sessionMessages(activeSession);
    applyTripSettings(activeSession.settings, { applyLanguage: false });
    writeHistoryOnly();
  } else if (history.length) {
    saveCurrentSession({ touch: false });
  } else {
    applyTripSettings({ ...DEFAULT_TRIP_SETTINGS, language: currentLanguage });
  }

  saveSessions();
  renderRecents();
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function iconSvg(name) {
  const paths = {
    more: '<circle cx="5" cy="12" r="1.5" /><circle cx="12" cy="12" r="1.5" /><circle cx="19" cy="12" r="1.5" />',
    share:
      '<path d="M12 4v12" /><path d="m7 9 5-5 5 5" /><path d="M5 15v2.5A2.5 2.5 0 0 0 7.5 20h9a2.5 2.5 0 0 0 2.5-2.5V15" />',
    rename:
      '<path d="M12 20h9" /><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" />',
    pin:
      '<path d="m14 4 6 6" /><path d="m5 13 8-8 6 6-8 8-1-5-5-1Z" /><path d="M4 20 9 15" />',
    trash:
      '<path d="M3 6h18" /><path d="M8 6V4h8v2" /><path d="M19 6l-1 16H6L5 6" /><path d="M10 11v6" /><path d="M14 11v6" />',
    copy:
      '<path d="M8 8h11v11H8z" /><path d="M5 15H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v1" />',
    edit:
      '<path d="M12 20h9" /><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" />',
    print:
      '<path d="M6 9V3h12v6" /><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" /><path d="M6 14h12v7H6z" /><path d="M17 12h.01" />',
  };

  return `<svg class="ui-icon" viewBox="0 0 24 24" aria-hidden="true">${paths[name] || ""}</svg>`;
}

function formatInline(value) {
  return value
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.*?)\*/g, "<em>$1</em>");
}

function cleanHeadingText(value) {
  return String(value || "")
    .replace(/^#+\s*/, "")
    .replace(/^\*+|\*+$/g, "")
    .replace(/[:\s]+$/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

const SECTION_MARKERS = {
  overview: { kind: "overview", labelKey: "tripOverview" },
  summary: { kind: "overview", labelKey: "sectionSummary" },
  route: { kind: "overview", labelKey: "sectionRouteTransport" },
  transport: { kind: "overview", labelKey: "sectionRouteTransport" },
  stay: { kind: "overview", labelKey: "sectionStayStrategy" },
  day: { kind: "day", labelKey: "dayPlan" },
  daily: { kind: "day", labelKey: "sectionDailyFlow" },
  "daily-flow": { kind: "day", labelKey: "sectionDailyFlow" },
  itinerary: { kind: "day", labelKey: "sectionDailyFlow" },
  weather: { kind: "notice", labelKey: "sectionWeather" },
  notice: { kind: "notice", labelKey: "weatherAndServiceNotices" },
  notices: { kind: "notice", labelKey: "weatherAndServiceNotices" },
  service: { kind: "notice", labelKey: "weatherAndServiceNotices" },
  context: { kind: "notice", labelKey: "liveContext" },
  places: { kind: "places", labelKey: "placesAndActivities" },
  activities: { kind: "places", labelKey: "placesAndActivities" },
  sights: { kind: "places", labelKey: "placesAndActivities" },
  highlights: { kind: "places", labelKey: "placesAndActivities" },
  budget: { kind: "tips", labelKey: "sectionBudget" },
  tips: { kind: "tips", labelKey: "tips" },
  sustainability: { kind: "tips", labelKey: "sectionSustainability" },
  packing: { kind: "tips", labelKey: "sectionPacking" },
  next: { kind: "tips", labelKey: "sectionSmartNextSteps" },
  notes: { kind: "tips", labelKey: "sectionNotes" },
};

function markerInfo(value) {
  return SECTION_MARKERS[String(value || "").toLowerCase()] || null;
}

function markerKind(value) {
  return markerInfo(value)?.kind || "";
}

function parsePlanMarker(line) {
  const match = line.trim().match(/^<!--\s*section\s*:\s*([a-z-]+)\s*-->$/i);
  return match ? markerInfo(match[1]) : null;
}

function stripSectionMarkers(value) {
  return String(value || "")
    .replace(/^<!--\s*section\s*:\s*[a-z-]+\s*-->\s*$/gim, "")
    .trim();
}

function sectionKindFromHeading(value) {
  const heading = cleanHeadingText(value).toLowerCase();
  if (!heading) return "";

  if (/\b(day|gun|gün)\s*\d{1,2}\b|اليوم\s*[\d٠-٩]*/iu.test(heading)) return "day";
  if (/\b(overview|summary|snapshot|at a glance|route|trip plan|travel plan|ozet|özet|rota|seyahat plani|seyahat planı|gezi plani|gezi planı)\b|نظرة|ملخص|مسار|خطة\s*(السفر|الرحلة)/iu.test(heading)) {
    return "overview";
  }
  if (/\b(weather|service notice|service notes|travel context|live context|conditions|hava|servis|baglam|bağlam|kosullar|koşullar)\b|الطقس|الخدمة|الخدمات|السياق|الأحوال/iu.test(heading)) {
    return "notice";
  }
  if (/\b(places|place|activities|activity|attractions|things to do|highlights|stops|sights|yerler|aktiviteler|gezilecek|duraklar|one cikan|öne çıkan)\b|الأماكن|الأنشطة|المعالم|الوجهات|أبرز/iu.test(heading)) {
    return "places";
  }
  if (/\b(budget|cost|costs|tips|practical|packing|transport|transit|eco|sustain|low carbon|lower carbon|notes|butce|bütçe|maliyet|ipuclari|ipuçlari|ipuçları|pratik|ulasim|ulaşım|surdurulebilir|sürdürülebilir|notlar)\b|الميزانية|التكلفة|نصائح|عملي|الأمتعة|النقل|الاستدامة|ملاحظات/iu.test(heading)) {
    return "tips";
  }

  return "";
}

function parsePlanHeading(line) {
  const trimmed = line.trim();
  if (!trimmed) return null;

  const markdownHeading = trimmed.match(/^(#{1,4})\s+(.+)$/);
  if (markdownHeading) {
    const title = cleanHeadingText(markdownHeading[2]);
    const kind = sectionKindFromHeading(title);
    return kind ? { title, kind, body: "" } : null;
  }

  const dayHeading = trimmed.match(/^((?:Day|Gün|Gun|اليوم)\s*[\d٠-٩]{0,2})(?:\s*[:\-–—]\s*(.+))?$/iu);
  if (dayHeading) {
    return {
      title: cleanHeadingText(dayHeading[1]),
      kind: "day",
      body: dayHeading[2]?.trim() || "",
    };
  }

  const boldHeading = trimmed.match(/^\*\*(.+?)\*\*:?\s*(.*)$/);
  if (boldHeading) {
    const title = cleanHeadingText(boldHeading[1]);
    const kind = sectionKindFromHeading(title);
    return kind ? { title, kind, body: boldHeading[2]?.trim() || "" } : null;
  }

  const inlineLabel = trimmed.match(/^([\p{L}][\p{L}\p{N} /&,+\-]{2,54}):\s*(.*)$/u);
  if (inlineLabel) {
    const title = cleanHeadingText(inlineLabel[1]);
    const kind = sectionKindFromHeading(title);
    return kind ? { title, kind, body: inlineLabel[2]?.trim() || "" } : null;
  }

  return null;
}

function hasMeaningfulLines(lines) {
  return lines.some((line) => line.trim());
}

function parsePlanSections(content) {
  const lines = String(content || "").split(/\r?\n/);
  const sections = [];
  const lead = [];
  let current = null;

  const pushCurrent = () => {
    if (!current) return;
    if (current.title || hasMeaningfulLines(current.lines)) {
      sections.push(current);
    }
    current = null;
  };

  const pushLead = () => {
    if (!hasMeaningfulLines(lead)) return;
    sections.push({
      title: t("tripOverview"),
      kind: "overview",
      lines: lead.splice(0),
    });
  };

  lines.forEach((line) => {
    const marker = parsePlanMarker(line);
    if (marker) {
      if (!current) pushLead();
      pushCurrent();
      current = {
        title: "",
        kind: marker.kind,
        labelKey: marker.labelKey,
        lines: [],
        fromMarker: true,
      };
      return;
    }

    const heading = parsePlanHeading(line);

    if (heading) {
      if (current?.fromMarker && !hasMeaningfulLines(current.lines)) {
        if (heading.body) current.lines.push(heading.body);
        return;
      }

      if (!current) pushLead();
      pushCurrent();
      current = {
        title: heading.title,
        kind: heading.kind,
        lines: heading.body ? [heading.body] : [],
      };
      return;
    }

    if (current) {
      current.lines.push(line);
    } else {
      lead.push(line);
    }
  });

  pushCurrent();
  if (!sections.length) pushLead();

  return sections.filter((section) => section.title || hasMeaningfulLines(section.lines));
}

function isStructuredTripPlan(sections, content) {
  if (!sections.length) return false;

  const dayCount = sections.filter((section) => section.kind === "day").length;
  const kindCount = new Set(sections.map((section) => section.kind)).size;
  const hasMarkers = sections.some((section) => section.fromMarker);
  const travelLanguage = /\b(trip|travel|itinerary|route|destination|stay|hotel|train|flight|budget|weather|places|activities|day\s+\d|gezi|seyahat|rota|otel|tren|ucak|uçak|butce|bütçe|hava|yerler|aktiviteler|gün\s*\d)\b|رحلة|سفر|مسار|فندق|قطار|طائرة|ميزانية|طقس|أماكن|أنشطة|اليوم/iu.test(
    content
  );

  return (
    (hasMarkers || travelLanguage) &&
    (dayCount > 0 ||
      sections.length >= 2 ||
      kindCount >= 2 ||
      (sections.length === 1 && sections[0].kind === "overview" && String(content).length > 220))
  );
}

function sectionLabel(kind) {
  if (kind === "day") return t("dayPlan");
  if (kind === "notice") return t("liveContext");
  if (kind === "places") return t("places");
  if (kind === "tips") return t("tips");
  return t("overview");
}

function sectionTitle(section) {
  if (section?.labelKey) return t(section.labelKey);
  return section?.title || sectionLabel(section?.kind);
}

function renderPlanSection(section) {
  const body = hasMeaningfulLines(section.lines) ? renderMarkdownLite(section.lines.join("\n")) : "";
  const title = sectionTitle(section);

  return `
    <section class="trip-plan-section trip-plan-${section.kind}">
      <header>
        <span>${sectionLabel(section.kind)}</span>
        <h3>${escapeHtml(title)}</h3>
      </header>
      ${body ? `<div class="trip-section-body">${body}</div>` : ""}
    </section>
  `;
}

function renderStructuredTripPlan(content) {
  const sections = parsePlanSections(content);
  if (!isStructuredTripPlan(sections, content)) return null;

  return `
    <div class="trip-plan" aria-label="${escapeHtml(t("tripPlanAria"))}">
      <div class="trip-plan-heading">
        <span>${escapeHtml(t("travelPlan"))}</span>
        <strong>${escapeHtml(t(sections.length === 1 ? "sectionCount" : "sectionCountPlural", { count: sections.length }))}</strong>
      </div>
      ${sections.map(renderPlanSection).join("")}
    </div>
  `;
}

function renderAssistantContent(content, options = {}) {
  if (!options.variant) {
    const structured = renderStructuredTripPlan(content);
    if (structured) {
      return { html: structured, structured: true };
    }
  }

  return { html: renderMarkdownLite(stripSectionMarkers(content)), structured: false };
}

function renderMarkdownLite(markdown) {
  const safe = escapeHtml(markdown.trim());
  const lines = safe.split(/\r?\n/);
  const html = [];
  let inList = false;

  for (const line of lines) {
    const trimmed = line.trim();

    if (!trimmed) {
      if (inList) {
        html.push("</ul>");
        inList = false;
      }
      continue;
    }

    if (trimmed.startsWith("### ")) {
      if (inList) html.push("</ul>");
      inList = false;
      html.push(`<h3>${trimmed.slice(4)}</h3>`);
      continue;
    }

    if (trimmed.startsWith("## ")) {
      if (inList) html.push("</ul>");
      inList = false;
      html.push(`<h2>${trimmed.slice(3)}</h2>`);
      continue;
    }

    if (trimmed.startsWith("# ")) {
      if (inList) html.push("</ul>");
      inList = false;
      html.push(`<h1>${trimmed.slice(2)}</h1>`);
      continue;
    }

    if (trimmed.startsWith("- ")) {
      if (!inList) {
        html.push("<ul>");
        inList = true;
      }
      html.push(`<li>${formatInline(trimmed.slice(2))}</li>`);
      continue;
    }

    if (/^\d+\.\s/.test(trimmed)) {
      if (!inList) {
        html.push("<ul>");
        inList = true;
      }
      html.push(`<li>${formatInline(trimmed.replace(/^\d+\.\s/, ""))}</li>`);
      continue;
    }

    if (inList) {
      html.push("</ul>");
      inList = false;
    }

    html.push(`<p>${formatInline(trimmed)}</p>`);
  }

  if (inList) html.push("</ul>");
  return html.join("");
}

function setStatus(label, isLoading = false) {
  if (!statusChip) return;
  statusChip.classList.toggle("loading", isLoading);
  statusChip.lastChild.textContent = ` ${label}`;
}

function setSignal(node, label) {
  if (node) node.textContent = label;
}

function setLoading(isLoading) {
  submitButton.disabled = isLoading;
  voiceButton?.classList.toggle("is-muted", isLoading);
  setStatus(isLoading ? t("thinking") : t("ready"), isLoading);
}

function scrollToBottom() {
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function renderWelcome() {
  chatMessages.innerHTML = `
    <div class="welcome-card">
      <div class="agent-orb">ET</div>
      <h2>${escapeHtml(t("whereNext"))}</h2>
      <p>
        ${escapeHtml(t("welcomeText"))}
      </p>
      <div class="prompt-grid">
        <button type="button" class="prompt-card">${escapeHtml(t("promptTrain"))}</button>
        <button type="button" class="prompt-card">${escapeHtml(t("promptFamily"))}</button>
        <button type="button" class="prompt-card">${escapeHtml(t("promptBudget"))}</button>
      </div>
    </div>
  `;

  chatMessages.querySelectorAll(".prompt-card").forEach((card) => {
    card.addEventListener("click", () => {
      messageInput.value = card.textContent.trim();
      autoResizeInput();
      messageInput.focus();
    });
  });
}

function createMessageAction(label, iconName) {
  const button = document.createElement("button");
  button.className = "message-action-button";
  button.type = "button";
  button.setAttribute("aria-label", label);
  button.title = label;
  button.innerHTML = iconSvg(iconName);
  return button;
}

function cleanPlanText(content) {
  return stripSectionMarkers(content)
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

async function writeClipboardText(text) {
  if (!text) throw new Error("Nothing to copy.");

  if (navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return;
    } catch {
      // Fall through to the legacy selection copy path.
    }
  }

  const temp = document.createElement("textarea");
  temp.value = text;
  temp.setAttribute("readonly", "");
  temp.style.position = "fixed";
  temp.style.inset = "0 auto auto 0";
  temp.style.opacity = "0";
  temp.style.pointerEvents = "none";
  document.body.appendChild(temp);
  temp.focus();
  temp.select();

  try {
    const copied = document.execCommand("copy");
    if (!copied) throw new Error("Copy command failed.");
  } finally {
    temp.remove();
  }
}

function actionButtonLabelNode(button) {
  return button?.querySelector("span") || null;
}

function setTemporaryActionLabel(button, label, fallbackLabel) {
  const labelNode = actionButtonLabelNode(button);
  button.classList.add("copied");
  button.setAttribute("aria-label", label);
  button.title = label;
  if (labelNode) labelNode.textContent = label;

  window.clearTimeout(Number(button.dataset.resetTimer || 0));
  const timer = window.setTimeout(() => {
    button.classList.remove("copied");
    button.setAttribute("aria-label", fallbackLabel);
    button.title = fallbackLabel;
    if (labelNode) labelNode.textContent = fallbackLabel;
    delete button.dataset.resetTimer;
  }, 1400);
  button.dataset.resetTimer = String(timer);
}

function tripPlanRowLanguage(row) {
  return normalizeLanguage(row?.dataset.planLanguage || currentLanguage);
}

function showTripPlanStatus(row, message, isError = false) {
  const status = row?.querySelector(".trip-plan-action-status");
  if (!status) return;

  status.textContent = message;
  status.classList.toggle("error", isError);
  status.hidden = false;
  window.clearTimeout(Number(status.dataset.resetTimer || 0));
  const timer = window.setTimeout(() => {
    status.hidden = true;
    status.textContent = "";
    status.classList.remove("error");
    delete status.dataset.resetTimer;
  }, 2600);
  status.dataset.resetTimer = String(timer);
}

async function copyMessageText(content, button) {
  try {
    await writeClipboardText(cleanPlanText(content));
  } catch (error) {
    console.warn("Could not copy message.", error);
    return;
  }

  setTemporaryActionLabel(button, t("copied"), t("copyMessage"));
}

function createTripPlanActionButton(action, labelKey, iconName) {
  const label = t(labelKey);
  const button = document.createElement("button");
  button.className = "trip-plan-action-button";
  button.type = "button";
  button.dataset.action = action;
  button.dataset.labelKey = labelKey;
  button.setAttribute("aria-label", label);
  button.title = action === "print" ? t("saveAsPdf") : label;
  button.innerHTML = `${iconSvg(iconName)}<span>${escapeHtml(label)}</span>`;
  return button;
}

function planSettingsFromPayload(payload = {}) {
  return normalizeTripSettings({
    language: payload.language,
    budget_level: payload.budget_level,
    travel_style: payload.travel_style,
    days: payload.days,
    travelers: payload.travelers,
    sustainability_priority: payload.sustainability_priority,
  });
}

function selectedPlanSettings(options = {}) {
  return normalizeTripSettings(options.settings || findCurrentSession()?.settings || readTripSettings());
}

function formatGeneratedDate(value, language = currentLanguage) {
  const date = new Date(value);
  const safeDate = Number.isFinite(date.getTime()) ? date : new Date();
  const locale = languageMeta(language).code;

  try {
    return new Intl.DateTimeFormat(locale, {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(safeDate);
  } catch {
    return safeDate.toLocaleString();
  }
}

function createTripPrintMeta(settings, createdAt) {
  const normalized = normalizeTripSettings(settings);
  const language = normalized.language;
  const meta = languageMeta(language);
  const wrapper = document.createElement("div");
  wrapper.className = "trip-print-meta";
  wrapper.dir = meta.dir;
  wrapper.lang = meta.code;

  const header = document.createElement("header");
  header.className = "trip-print-header";

  const title = document.createElement("h1");
  title.textContent = "Eco Travel Planner";

  const subtitle = document.createElement("p");
  subtitle.textContent = t("generatedByEcoTravelPlanner", {}, language);

  const date = document.createElement("small");
  date.textContent = `${t("generatedDate", {}, language)}: ${formatGeneratedDate(createdAt, language)}`;

  header.appendChild(title);
  header.appendChild(subtitle);
  header.appendChild(date);

  const settingsBox = document.createElement("section");
  settingsBox.className = "trip-print-settings";

  const settingsTitle = document.createElement("h2");
  settingsTitle.textContent = t("tripSettings", {}, language);

  const list = document.createElement("dl");
  const rows = [
    [t("language", {}, language), meta.nativeLabel],
    [t("budget", {}, language), translatedBudget(normalized.budget, language)],
    [t("travelStyle", {}, language), translatedTravelStyle(normalized.travelStyle, language)],
    [t("days", {}, language), String(normalized.days)],
    [t("travelers", {}, language), String(normalized.travelers)],
    [t("sustainability", {}, language), `${normalized.sustainability}/5`],
  ];

  rows.forEach(([label, value]) => {
    const term = document.createElement("dt");
    const description = document.createElement("dd");
    term.textContent = label;
    description.textContent = value;
    list.appendChild(term);
    list.appendChild(description);
  });

  settingsBox.appendChild(settingsTitle);
  settingsBox.appendChild(list);
  wrapper.appendChild(header);
  wrapper.appendChild(settingsBox);
  return wrapper;
}

async function copyTripPlan(content, row, button) {
  const language = tripPlanRowLanguage(row);
  try {
    await writeClipboardText(cleanPlanText(content));
    setTemporaryActionLabel(button, t("copied", {}, language), t("copy", {}, language));
  } catch (error) {
    console.warn("Could not copy trip plan.", error);
    showTripPlanStatus(row, t("couldNotCopy", {}, language), true);
  }
}

function isShareCancellation(error) {
  const name = String(error?.name || "").toLowerCase();
  const message = String(error?.message || "").toLowerCase();
  return name === "aborterror" || message.includes("abort") || message.includes("cancel");
}

async function shareTripPlan(content, row, button) {
  const language = tripPlanRowLanguage(row);
  const title = t("travelPlan", {}, language);
  const fallbackText = cleanPlanText(content);
  let shareLink = "";

  try {
    const data = await createShortShareLink({
      title,
      history: history.length ? history : [{ role: "assistant", content: fallbackText }],
      settings: selectedPlanSettings({
        settings: row?.dataset.planSettings ? JSON.parse(row.dataset.planSettings) : undefined,
      }),
    });
    shareLink = data.url;
  } catch (error) {
    console.warn("Could not create short share link for trip plan.", error);
    shareLink = window.location.href.split("#")[0];
  }

  if (navigator.share && shareLink) {
    try {
      await navigator.share({ title, text: shareLink, url: shareLink });
      setTemporaryActionLabel(button, t("sharedSuccessfully", {}, language), t("share", {}, language));
      showTripPlanStatus(row, t("sharedSuccessfully", {}, language));
      return;
    } catch (error) {
      if (isShareCancellation(error)) return;
      console.warn("Native sharing failed, falling back to clipboard.", error);
    }
  }

  try {
    await writeClipboardText(shareLink || fallbackText);
    setTemporaryActionLabel(button, t("shareLinkCopied", {}, language), t("share", {}, language));
    showTripPlanStatus(row, t("shareLinkCopied", {}, language));
  } catch (error) {
    console.warn("Could not copy share link.", error);
    showTripPlanStatus(row, t("couldNotCopyShareLink", {}, language), true);
  }
}


let printCleanupTimer = null;
let activePrintReport = null;

function clearTripPrintTarget() {
  document.body.classList.remove("printing-trip-plan", "printing-trip-report");
  document.querySelectorAll(".message-row.print-target").forEach((row) => {
    row.classList.remove("print-target");
  });
  activePrintReport?.remove();
  activePrintReport = null;
  window.clearTimeout(printCleanupTimer);
  printCleanupTimer = null;
}

function stripExportFiller(value) {
  return stripSectionMarkers(value)
    .split(/\r?\n/)
    .filter((line) => {
      const clean = line.trim().toLowerCase();
      if (!clean) return true;
      return !(
        clean.includes("feel free to ask") ||
        clean.includes("let me know") ||
        clean.includes("if you want") ||
        clean.includes("happy to refine") ||
        clean.includes("başka bir") ||
        clean.includes("istersen") ||
        clean.includes("إذا أردت") ||
        clean.includes("يمكنني")
      );
    })
    .join("\n")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function printElement(tag, className = "", text = "") {
  const element = document.createElement(tag);
  if (className) element.className = className;
  if (text) element.textContent = text;
  return element;
}

function printInline(value) {
  return escapeHtml(value)
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.*?)\*/g, "<em>$1</em>");
}

function isMarkdownTableStart(lines, index) {
  const current = lines[index]?.trim() || "";
  const next = lines[index + 1]?.trim() || "";
  return current.includes("|") && /^\|?\s*:?-{3,}:?\s*(\|\s*:?-{3,}:?\s*)+\|?$/.test(next);
}

function tableCells(line) {
  return line
    .trim()
    .replace(/^\|/, "")
    .replace(/\|$/, "")
    .split("|")
    .map((cell) => cell.trim());
}

function appendPrintTable(parent, tableLines) {
  const table = printElement("table", "print-table");
  const thead = document.createElement("thead");
  const tbody = document.createElement("tbody");
  const headers = tableCells(tableLines[0]);

  const headRow = document.createElement("tr");
  headers.forEach((header) => {
    const th = document.createElement("th");
    th.innerHTML = printInline(header);
    headRow.appendChild(th);
  });
  thead.appendChild(headRow);

  tableLines.slice(2).forEach((line) => {
    if (!line.trim() || !line.includes("|")) return;
    const row = document.createElement("tr");
    tableCells(line).forEach((cell) => {
      const td = document.createElement("td");
      td.innerHTML = printInline(cell);
      row.appendChild(td);
    });
    tbody.appendChild(row);
  });

  table.appendChild(thead);
  table.appendChild(tbody);
  parent.appendChild(table);
}

function appendPrintMarkdown(parent, markdown) {
  const lines = stripExportFiller(markdown).split(/\r?\n/);
  let list = null;
  let orderedList = null;

  const closeLists = () => {
    list = null;
    orderedList = null;
  };

  for (let index = 0; index < lines.length; index += 1) {
    const raw = lines[index];
    const trimmed = raw.trim();

    if (!trimmed) {
      closeLists();
      continue;
    }

    if (isMarkdownTableStart(lines, index)) {
      closeLists();
      const tableLines = [lines[index], lines[index + 1]];
      index += 2;
      while (index < lines.length && lines[index].includes("|")) {
        tableLines.push(lines[index]);
        index += 1;
      }
      index -= 1;
      appendPrintTable(parent, tableLines);
      continue;
    }

    const heading = trimmed.match(/^(#{1,4})\s+(.+)$/);
    if (heading) {
      closeLists();
      const level = Math.min(4, Math.max(3, heading[1].length + 1));
      const node = printElement(`h${level}`, "print-subheading");
      node.innerHTML = printInline(cleanHeadingText(heading[2]));
      parent.appendChild(node);
      continue;
    }

    if (trimmed.startsWith("- ")) {
      orderedList = null;
      if (!list) {
        list = printElement("ul", "print-list");
        parent.appendChild(list);
      }
      const item = document.createElement("li");
      item.innerHTML = printInline(trimmed.slice(2));
      list.appendChild(item);
      continue;
    }

    const numbered = trimmed.match(/^\d+\.\s+(.+)$/);
    if (numbered) {
      list = null;
      if (!orderedList) {
        orderedList = printElement("ol", "print-list print-list-numbered");
        parent.appendChild(orderedList);
      }
      const item = document.createElement("li");
      item.innerHTML = printInline(numbered[1]);
      orderedList.appendChild(item);
      continue;
    }

    closeLists();
    const paragraph = printElement("p", "print-paragraph");
    paragraph.innerHTML = printInline(trimmed);
    parent.appendChild(paragraph);
  }
}

function sectionKey(section) {
  const text = `${section?.labelKey || ""} ${section?.title || ""}`.toLowerCase();
  if (section?.kind === "day") return "day";
  if (text.includes("transport") || text.includes("route") || text.includes("ulaş") || text.includes("النقل") || text.includes("المسار")) return "transport";
  if (text.includes("stay") || text.includes("hotel") || text.includes("konak") || text.includes("الإقامة")) return "stay";
  if (text.includes("budget") || text.includes("cost") || text.includes("bütçe") || text.includes("الميزانية")) return "budget";
  if (text.includes("sustain") || text.includes("eco") || text.includes("sürdürü") || text.includes("الاستدامة")) return "sustainability";
  if (text.includes("weather") || text.includes("packing") || text.includes("hava") || text.includes("الطقس")) return "weather";
  if (text.includes("next") || text.includes("step") || text.includes("sonraki") || text.includes("الخطوات")) return "next";
  if (section?.kind === "overview") return "overview";
  return section?.kind || "notes";
}

function appendPrintSection(report, title, sections, className = "") {
  const available = sections.filter((section) => hasMeaningfulLines(section.lines));
  if (!available.length) return;

  const section = printElement("section", `print-section ${className}`.trim());
  section.appendChild(printElement("h2", "print-section-title", title));
  available.forEach((item) => appendPrintMarkdown(section, item.lines.join("\n")));
  report.appendChild(section);
}

function appendItinerarySection(report, daySections, language) {
  const days = daySections.filter((section) => hasMeaningfulLines(section.lines));
  if (!days.length) return;

  const section = printElement("section", "print-section print-itinerary-section");
  section.appendChild(printElement("h2", "print-section-title", t("sectionDailyFlow", {}, language)));
  const grid = printElement("div", "print-day-grid");

  days.forEach((day, index) => {
    const card = printElement("article", "print-day-card");
    const title = sectionTitle(day) || `${t("dayPlan", {}, language)} ${index + 1}`;
    card.appendChild(printElement("h3", "print-day-title", title));
    appendPrintMarkdown(card, day.lines.join("\n"));
    grid.appendChild(card);
  });

  section.appendChild(grid);
  report.appendChild(section);
}

function firstUsefulTitle() {
  const current = findCurrentSession()?.title || titleFromHistory(history);
  return current && current !== t("newTrip") ? current : t("travelPlan");
}

function createPrintableTripReport(content, row) {
  const createdAt = row?.dataset.planCreatedAt || new Date().toISOString();
  const settings = selectedPlanSettings({
    settings: row?.dataset.planSettings ? JSON.parse(row.dataset.planSettings) : undefined,
  });
  const language = settings.language;
  const meta = languageMeta(language);
  const cleanContent = stripExportFiller(content);
  const sections = parsePlanSections(cleanContent);
  const report = printElement("article", "trip-print-report");
  report.dir = meta.dir;
  report.lang = meta.code;

  const cover = printElement("header", "print-cover");
  cover.appendChild(printElement("p", "print-kicker", "Eco Travel Planner"));
  cover.appendChild(printElement("h1", "print-title", firstUsefulTitle()));
  cover.appendChild(printElement("p", "print-credit", t("sidebarCredit", {}, language)));
  cover.appendChild(printElement("p", "print-version", `Eco Travel Planner v${APP_VERSION}`));
  cover.appendChild(printElement("p", "print-date", `${t("generatedDate", {}, language)}: ${formatGeneratedDate(createdAt, language)}`));
  report.appendChild(cover);

  const settingsSection = printElement("section", "print-section print-settings-section");
  settingsSection.appendChild(printElement("h2", "print-section-title", t("tripSettings", {}, language)));
  const settingsTable = printElement("table", "print-table print-settings-table");
  const tbody = document.createElement("tbody");
  [
    [t("language", {}, language), meta.nativeLabel],
    [t("budget", {}, language), translatedBudget(settings.budget, language)],
    [t("travelStyle", {}, language), translatedTravelStyle(settings.travelStyle, language)],
    [t("days", {}, language), String(settings.days)],
    [t("travelers", {}, language), String(settings.travelers)],
    [t("sustainability", {}, language), `${settings.sustainability}/5`],
  ].forEach(([label, value]) => {
    const tableRow = document.createElement("tr");
    tableRow.appendChild(printElement("th", "", label));
    tableRow.appendChild(printElement("td", "", value));
    tbody.appendChild(tableRow);
  });
  settingsTable.appendChild(tbody);
  settingsSection.appendChild(settingsTable);
  report.appendChild(settingsSection);

  const groups = sections.reduce((result, section) => {
    const key = sectionKey(section);
    result[key] = result[key] || [];
    result[key].push(section);
    return result;
  }, {});

  appendPrintSection(report, t("sectionSummary", {}, language), groups.overview || [], "print-summary-section");
  appendPrintSection(report, t("sectionRouteTransport", {}, language), groups.transport || [], "print-transport-section");
  appendItinerarySection(report, groups.day || [], language);
  appendPrintSection(report, t("sectionStayStrategy", {}, language), groups.stay || [], "print-stay-section");
  appendPrintSection(report, t("sectionBudget", {}, language), groups.budget || [], "print-budget-section");
  appendPrintSection(report, t("sectionSustainability", {}, language), groups.sustainability || [], "print-sustainability-section");
  appendPrintSection(report, t("sectionWeather", {}, language), groups.weather || [], "print-weather-section");
  appendPrintSection(report, t("sectionSmartNextSteps", {}, language), groups.next || [], "print-next-section");

  const footer = printElement("footer", "print-report-footer");
  footer.textContent = `${appBaseUrl()} · Eco Travel Planner v${APP_VERSION}`;
  report.appendChild(footer);
  return report;
}

function exportTripPlanPdf(row, content = "") {
  if (!row) return;

  clearTripPrintTarget();
  row.classList.add("print-target");
  activePrintReport = createPrintableTripReport(content, row);
  document.body.appendChild(activePrintReport);
  document.body.classList.add("printing-trip-report");

  window.setTimeout(() => {
    window.print();
    printCleanupTimer = window.setTimeout(clearTripPrintTarget, 120000);
  }, 80);
}


function createTripPlanActions(row, content) {
  const actions = document.createElement("div");
  actions.className = "trip-plan-actions";

  const buttons = [
    createTripPlanActionButton("copy", "copy", "copy"),
    createTripPlanActionButton("share", "share", "share"),
    createTripPlanActionButton("print", "exportPdf", "print"),
  ];

  const status = document.createElement("span");
  status.className = "trip-plan-action-status";
  status.setAttribute("role", "status");
  status.setAttribute("aria-live", "polite");
  status.hidden = true;

  buttons[0].addEventListener("click", () => copyTripPlan(content, row, buttons[0]));
  buttons[1].addEventListener("click", () => shareTripPlan(content, row, buttons[1]));
  buttons[2].addEventListener("click", () => exportTripPlanPdf(row, content));

  buttons.forEach((button) => actions.appendChild(button));
  actions.appendChild(status);
  return actions;
}

function saveEditedMessage(index, content) {
  if (!Number.isInteger(index) || !history[index]) return;

  history[index] = {
    ...history[index],
    content,
  };
  writeHistoryOnly();
  saveCurrentSession();
  renderRecents();
  renderHistory();
}

function startMessageEdit(row, bubble, content, historyIndex) {
  if (!Number.isInteger(historyIndex)) {
    messageInput.value = content;
    autoResizeInput();
    messageInput.focus();
    return;
  }

  const stack = row.querySelector(".message-stack");
  const actions = row.querySelector(".message-actions");
  const editor = document.createElement("form");
  editor.className = "message-editor";

  const textarea = document.createElement("textarea");
  textarea.value = content;
  textarea.rows = Math.min(8, Math.max(2, content.split(/\r?\n/).length));

  const controls = document.createElement("div");
  controls.className = "message-editor-actions";

  const cancel = document.createElement("button");
  cancel.type = "button";
  cancel.textContent = t("cancel");

  const save = document.createElement("button");
  save.type = "submit";
  save.textContent = t("save");

  controls.appendChild(cancel);
  controls.appendChild(save);
  editor.appendChild(textarea);
  editor.appendChild(controls);

  bubble.hidden = true;
  if (actions) actions.hidden = true;
  stack.appendChild(editor);

  textarea.focus();
  textarea.select();

  cancel.addEventListener("click", () => {
    editor.remove();
    bubble.hidden = false;
    if (actions) actions.hidden = false;
  });

  editor.addEventListener("submit", (event) => {
    event.preventDefault();
    const next = textarea.value.trim();
    if (!next) {
      textarea.focus();
      return;
    }
    saveEditedMessage(historyIndex, next);
  });
}

function createMessageActions(row, bubble, content, historyIndex) {
  const actions = document.createElement("div");
  actions.className = "message-actions";

  const copy = createMessageAction(t("copyMessage"), "copy");
  const edit = createMessageAction(t("editMessage"), "edit");

  copy.addEventListener("click", () => copyMessageText(content, copy));
  edit.addEventListener("click", () => startMessageEdit(row, bubble, content, historyIndex));

  actions.appendChild(copy);
  actions.appendChild(edit);
  return actions;
}

function appendMessage(role, content, meta = "", attachments = [], historyIndex = null, options = {}) {
  if (chatMessages.querySelector(".welcome-card")) {
    chatMessages.innerHTML = "";
  }

  const row = document.createElement("article");
  row.className = `message-row ${role}`;
  if (options.variant) {
    row.classList.add(options.variant);
  }
  if (options.live) {
    row.setAttribute("aria-live", "polite");
  }
  if (Number.isInteger(historyIndex)) {
    row.dataset.historyIndex = String(historyIndex);
  }

  const stack = document.createElement("div");
  stack.className = "message-stack";

  const bubble = document.createElement("div");
  bubble.className = "message-bubble";
  if (options.bubbleClass) {
    bubble.classList.add(options.bubbleClass);
  }
  bubble.dir = "auto";
  let rendered = null;
  if (role === "assistant") {
    rendered = renderAssistantContent(content, options);
    bubble.innerHTML = rendered.html;
    if (rendered.structured) {
      bubble.classList.add("structured-plan");
      row.classList.add("has-trip-plan");
    }
  } else {
    bubble.innerHTML = `<p>${escapeHtml(content)}</p>`;
  }

  if (role === "user" && attachments.length) {
    const attachmentList = document.createElement("div");
    attachmentList.className = "message-attachments";
    attachments.forEach((attachment) => {
      const chip = document.createElement("span");
      chip.className = "message-attachment-chip";
      chip.textContent = attachment.name;
      attachmentList.appendChild(chip);
    });
    bubble.appendChild(attachmentList);
  }

  if (meta) {
    const metaNode = document.createElement("div");
    metaNode.className = "message-meta";
    metaNode.textContent = meta;
    bubble.appendChild(metaNode);
  }

  if (rendered?.structured) {
    const planSettings = selectedPlanSettings(options);
    const createdAt = options.createdAt || new Date().toISOString();
    const meta = languageMeta(planSettings.language);
    row.dataset.planLanguage = planSettings.language;
    row.dataset.planCreatedAt = createdAt;
    row.dataset.planSettings = JSON.stringify(planSettings);
    row.dir = meta.dir;
    stack.appendChild(createTripPrintMeta(planSettings, createdAt));
  }

  stack.appendChild(bubble);
  if (options.actions !== false) {
    stack.appendChild(
      rendered?.structured
        ? createTripPlanActions(row, content)
        : createMessageActions(row, bubble, content, historyIndex)
    );
  }

  row.appendChild(stack);
  chatMessages.appendChild(row);
  scrollToBottom();
  return row;
}

function showTyping(payload = {}) {
  const days = Number(payload.days) || Number(daysInput.value) || 0;
  const travelers = Number(payload.travelers) || Number(travelersInput.value) || 0;
  const tripSummary =
    days && travelers
      ? t("loadingTripSummary", {
          days,
          dayLabel: t(days === 1 ? "daySingular" : "dayPlural"),
          travelers,
          travelerLabel: t(travelers === 1 ? "traveler" : "travelersLower"),
        })
      : t("preparingItinerary");

  typingNode = appendMessage("assistant", t("loadingTripPlan"), "", [], null, {
    actions: false,
    variant: "loading",
    live: true,
  });

  typingNode.querySelector(".message-bubble").innerHTML = `
    <div class="plan-loading-card" role="status" aria-live="polite">
      <div class="plan-loading-head">
        <span class="plan-spinner" aria-hidden="true"></span>
        <div>
          <strong>${escapeHtml(t("loadingTripPlan"))}</strong>
          <small>${tripSummary}</small>
        </div>
      </div>
      <ol class="plan-loading-steps">
        <li>${escapeHtml(t("readingSettings"))}</li>
        <li>${escapeHtml(t("checkingContext"))}</li>
        <li>${escapeHtml(t("draftingItinerary"))}</li>
      </ol>
    </div>
  `;
}

function removeTyping() {
  if (typingNode) {
    typingNode.remove();
    typingNode = null;
  }
}

function renderHistory() {
  if (!history.length) {
    renderWelcome();
    return;
  }

  chatMessages.innerHTML = "";
  history.forEach((item, index) =>
    appendMessage(item.role, item.content, "", [], index, {
      createdAt: item.createdAt,
      settings: item.settings,
    })
  );
}

function buildRequest(message) {
  return {
    message,
    language: currentLanguage,
    travel_style: travelStyle,
    budget_level: budgetInput.value,
    sustainability_priority: Number(sustainabilityInput.value),
    travelers: Number(travelersInput.value),
    days: Number(daysInput.value),
    history: history.slice(-MAX_CONTEXT_MESSAGES),
    attachments: pendingAttachments.map((attachment) => ({
      name: attachment.name,
      mime_type: attachment.mime_type,
      size: attachment.size,
      data_url: attachment.data_url || null,
      text: attachment.text || null,
    })),
  };
}

function contextMeta(data) {
  const parts = [];
  if (data.weather) parts.push(`${t("weatherApi")}: ${Math.round(data.weather.temperature_c)} C, ${data.weather.description}`);
  if (data.places?.length) parts.push(t("locationMatches", { count: data.places.length }));
  if (data.model) parts.push(data.model);
  return parts.join(" | ");
}

function answerMentionsAny(answer, terms) {
  const lower = String(answer || "").toLowerCase();
  return terms.some((term) => lower.includes(term));
}

function formatWeatherLine(weather) {
  if (!weather) return "";

  const details = [
    Number.isFinite(Number(weather.temperature_c)) ? `${Math.round(weather.temperature_c)} C` : "",
    weather.description,
    Number.isFinite(Number(weather.humidity)) ? `${weather.humidity}% ${t("humidity")}` : "",
    Number.isFinite(Number(weather.wind_speed)) ? `${Math.round(weather.wind_speed)} km/h ${t("wind")}` : "",
  ].filter(Boolean);

  const summary = details.length ? `: ${details.join(", ")}` : "";
  return `- ${t("weatherIn", { city: weather.city || t("destination") })}${summary}`;
}

function formatPlaceLine(place) {
  const name = place?.name || t("localPlace");
  const type = place?.type ? ` (${place.type})` : "";
  const displayName = place?.display_name && place.display_name !== name ? `: ${place.display_name}` : "";
  return `- ${name}${type}${displayName}`;
}

function buildAssistantContextSections(data = {}) {
  const answer = String(data.answer || "");
  const sections = [];
  const notices = Array.isArray(data.service_notices)
    ? data.service_notices.filter((notice) => notice?.message)
    : [];

  const shouldAddWeather =
    Boolean(data.weather) &&
    !answerMentionsAny(answer, ["weather", "temperature", "forecast", "conditions"]);
  const shouldAddNotices = notices.length > 0;

  if (shouldAddWeather || shouldAddNotices) {
    const lines = [];
    if (shouldAddWeather) {
      lines.push(formatWeatherLine(data.weather));
    }
    notices.forEach((notice) => {
      lines.push(`- ${serviceNoticeLabel(notice.source)}: ${notice.message}`);
    });

    sections.push(`<!--section:notice-->\n## ${t("weatherAndServiceNotices")}\n${lines.join("\n")}`);
  }

  if (
    Array.isArray(data.places) &&
    data.places.length &&
    !answerMentionsAny(answer, ["places", "activities", "attractions", "things to do", "sights"])
  ) {
    sections.push(`<!--section:places-->\n## ${t("placesAndActivities")}\n${data.places.slice(0, 4).map(formatPlaceLine).join("\n")}`);
  }

  return sections.join("\n\n");
}

function buildAssistantMessageContent(data = {}) {
  const answer = String(data.answer || "").trim() || t("fallbackPlanMessage");
  const contextSections = buildAssistantContextSections(data);
  return [answer, contextSections].filter(Boolean).join("\n\n");
}

function detailToText(detail) {
  if (!detail) return "";
  if (typeof detail === "string") return detail;

  if (Array.isArray(detail)) {
    return detail
      .map((item) => {
        if (!item || typeof item !== "object") return String(item);
        const location = Array.isArray(item.loc) ? item.loc.join(".") : "";
        return [location, item.msg].filter(Boolean).join(": ");
      })
      .filter(Boolean)
      .join(" ");
  }

  if (typeof detail === "object") {
    return String(detail.message || detail.detail || JSON.stringify(detail));
  }

  return String(detail);
}

function classifyHttpError(response, data) {
  const detail = detailToText(data?.detail) || response.statusText || "The request failed.";
  const lowerDetail = detail.toLowerCase();

  if (
    lowerDetail.includes("ai api") ||
    lowerDetail.includes("openrouter") ||
    lowerDetail.includes("openrouter_api_key") ||
    [401, 403, 429, 502, 504].includes(response.status)
  ) {
    return {
      title: t("aiApiIssue"),
      message: detail,
      status: response.status,
    };
  }

  if (response.status === 422) {
    return {
      title: t("requestIssue"),
      message: t("requestIssueMessage", { detail }),
      status: response.status,
    };
  }

  if (response.status >= 500) {
    return {
      title: t("backendIssue"),
      message: detail,
      status: response.status,
    };
  }

  return {
    title: t("requestFailed"),
    message: detail,
    status: response.status,
  };
}

function displayError(error) {
  if (error?.title && error?.message) return error;

  if (error instanceof TypeError) {
    return {
      title: t("backendUnavailable"),
      message: t("backendUnavailableMessage"),
    };
  }

  return {
    title: t("requestFailed"),
    message: error?.message || t("requestFailedMessage"),
  };
}

function appendErrorMessage(title, message) {
  appendMessage("assistant", `**${title}**\n\n${message}`, "", [], null, {
    actions: false,
    variant: "error",
    live: true,
  });
}

function serviceNoticeLabel(source) {
  if (source === "weather") return t("weatherApi");
  if (source === "places") return t("placesService");
  return t("travelContext");
}

async function submitPlan(event) {
  event.preventDefault();

  const typedMessage = messageInput.value.trim();
  const attachmentsForRequest = pendingAttachments.slice();

  if (!attachmentsForRequest.length && typedMessage.length < 2) {
    messageInput.focus();
    return;
  }

  const attachmentPrompt = t("attachmentPrompt");
  const message =
    typedMessage.length >= 2
      ? typedMessage
      : [typedMessage, attachmentPrompt].filter(Boolean).join(" ");

  const payload = buildRequest(message);
  const userCreatedAt = new Date().toISOString();
  messageInput.value = "";
  clearPendingAttachments();
  autoResizeInput();
  appendMessage("user", message, "", attachmentsForRequest);
  history = [
    ...history,
    { role: "user", content: userHistoryContent(message, attachmentsForRequest), createdAt: userCreatedAt },
  ].slice(-MAX_HISTORY_MESSAGES);
  saveHistory();
  setLoading(true);
  showTyping(payload);

  setSignal(
    routeSignal,
    t("routeSignal", {
      days: payload.days,
      travelers: payload.travelers,
      travelerLabel: t(payload.travelers === 1 ? "traveler" : "travelersLower"),
    })
  );
  setSignal(weatherSignal, t("checkingWeather"));
  setSignal(locationSignal, t("searchingGeodata"));

  try {
    const response = await fetch(`${API_BASE}/api/plan`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      const classified = classifyHttpError(response, data);
      throw Object.assign(new Error(classified.message), classified);
    }

    const assistantContent = buildAssistantMessageContent(data);
    const assistantSettings = planSettingsFromPayload(payload);
    const assistantCreatedAt = new Date().toISOString();

    removeTyping();
    appendMessage("assistant", assistantContent, contextMeta(data), [], null, {
      createdAt: assistantCreatedAt,
      settings: assistantSettings,
    });

    setSignal(
      weatherSignal,
      data.weather ? `${Math.round(data.weather.temperature_c)} C, ${data.weather.description}` : t("noLiveWeather")
    );
    setSignal(locationSignal, data.places?.length ? t("locationMatches", { count: data.places.length }) : t("noLocationContext"));

    history = [
      ...history,
      {
        role: "assistant",
        content: assistantContent,
        createdAt: assistantCreatedAt,
        settings: assistantSettings,
      },
    ].slice(-MAX_HISTORY_MESSAGES);
    saveHistory();
  } catch (error) {
    removeTyping();
    const errorForDisplay = displayError(error);
    appendErrorMessage(errorForDisplay.title, errorForDisplay.message);
    setSignal(weatherSignal, t("unavailable"));
    setSignal(locationSignal, t("unavailable"));
  } finally {
    setLoading(false);
  }
}

function autoResizeInput() {
  messageInput.style.height = "auto";
  messageInput.style.height = `${Math.min(messageInput.scrollHeight, 150)}px`;
}

function userHistoryContent(message, attachments = []) {
  if (!attachments.length) return message;
  const names = attachments.map((attachment) => attachment.name).join(", ");
  return `${message}\n\n${t("attachedFiles", { names })}`;
}

function fileSizeLabel(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function readAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = () => reject(reader.error || new Error("Could not read file."));
    reader.readAsDataURL(file);
  });
}

function readAsText(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = () => reject(reader.error || new Error("Could not read file."));
    reader.readAsText(file);
  });
}

function renderAttachmentTray() {
  if (!attachmentTray) return;

  attachmentTray.innerHTML = "";
  attachmentTray.hidden = pendingAttachments.length === 0;

  pendingAttachments.forEach((attachment, index) => {
    const chip = document.createElement("div");
    chip.className = "attachment-chip";

    if (attachment.preview_url) {
      const image = document.createElement("img");
      image.src = attachment.preview_url;
      image.alt = "";
      chip.appendChild(image);
    } else {
      const icon = document.createElement("span");
      icon.className = "attachment-file-icon";
      icon.textContent = "TXT";
      chip.appendChild(icon);
    }

    const text = document.createElement("span");
    text.className = "attachment-chip-name";
    text.textContent = `${attachment.name} (${fileSizeLabel(attachment.size)})`;

    const removeButton = document.createElement("button");
    removeButton.type = "button";
    removeButton.setAttribute("aria-label", t("removeAttachment", { name: attachment.name }));
    removeButton.textContent = "x";
    removeButton.addEventListener("click", () => {
      pendingAttachments = pendingAttachments.filter((_, itemIndex) => itemIndex !== index);
      renderAttachmentTray();
    });

    chip.appendChild(text);
    chip.appendChild(removeButton);
    attachmentTray.appendChild(chip);
  });
}

function clearPendingAttachments() {
  pendingAttachments = [];
  renderAttachmentTray();
  if (fileInput) fileInput.value = "";
  if (messageInput) messageInput.placeholder = t("askAnything");
}

async function addFiles(files) {
  const selectedFiles = Array.from(files || []).slice(0, 4);
  const maxBytes = 6 * 1024 * 1024;
  const nextAttachments = [];

  for (const file of selectedFiles) {
    if (file.size > maxBytes) {
      window.alert(t("fileTooLarge", { name: file.name }));
      continue;
    }

    const isImage = file.type.startsWith("image/");
    const isText =
      file.type.startsWith("text/") ||
      /\.(txt|md|csv)$/i.test(file.name);

    if (!isImage && !isText) {
      window.alert(t("unsupportedFile", { name: file.name }));
      continue;
    }

    if (isImage) {
      const dataUrl = await readAsDataUrl(file);
      nextAttachments.push({
        name: file.name,
        mime_type: file.type || "image/*",
        size: file.size,
        data_url: dataUrl,
        preview_url: dataUrl,
      });
      continue;
    }

    const text = await readAsText(file);
    nextAttachments.push({
      name: file.name,
      mime_type: file.type || "text/plain",
      size: file.size,
      text: text.slice(0, 12000),
    });
  }

  pendingAttachments = [...pendingAttachments, ...nextAttachments].slice(0, 4);
  renderAttachmentTray();

  if (pendingAttachments.length && !messageInput.value.trim()) {
    messageInput.placeholder = t("addTravelFile");
  }
}

function toggleAddFilesMenu(forceOpen = null) {
  if (!addFilesMenu || !addContextButton) return;

  const shouldOpen = forceOpen ?? addFilesMenu.hidden;
  addFilesMenu.hidden = !shouldOpen;
  addContextButton.classList.toggle("active", shouldOpen);
  addContextButton.setAttribute("aria-expanded", String(shouldOpen));
}

function speechLanguage() {
  const language = currentLanguage.toLowerCase();
  if (language.includes("arabic")) return "ar-SA";
  if (language.includes("turkish")) return "tr-TR";
  return "en-US";
}

function setVoiceStatus(message) {
  if (voiceStatus) voiceStatus.textContent = message;
}

function setListening(nextState) {
  isListening = nextState;
  voiceButton?.classList.toggle("listening", nextState);
  voiceButton?.setAttribute("aria-label", nextState ? t("stopVoiceInput") : t("startVoiceInput"));
  setVoiceStatus(nextState ? t("listening") : t("voiceStopped"));
}

function setupVoiceRecognition() {
  const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!voiceButton || !Recognition) {
    voiceButton?.setAttribute("disabled", "true");
    voiceButton?.setAttribute("title", t("voiceUnsupported"));
    setVoiceStatus(t("voiceUnsupported"));
    return null;
  }

  const instance = new Recognition();
  instance.continuous = false;
  instance.interimResults = true;
  instance.lang = speechLanguage();

  instance.onstart = () => {
    voiceBaseText = messageInput.value.trimEnd();
    setListening(true);
  };

  instance.onresult = (event) => {
    let transcript = "";
    for (let index = 0; index < event.results.length; index += 1) {
      transcript += event.results[index][0].transcript;
    }

    const spokenText = transcript.replace(/\s+/g, " ").trim();
    messageInput.value = [voiceBaseText, spokenText].filter(Boolean).join(voiceBaseText && spokenText ? " " : "");
    autoResizeInput();
  };

  instance.onerror = (event) => {
    setVoiceStatus(t("voiceInputError", { error: event.error }));
  };

  instance.onend = () => {
    setListening(false);
  };

  return instance;
}

function toggleVoiceInput() {
  if (!recognition) {
    recognition = setupVoiceRecognition();
  }
  if (!recognition) return;

  recognition.lang = speechLanguage();

  if (isListening) {
    recognition.stop();
    return;
  }

  try {
    recognition.start();
  } catch {
    setVoiceStatus(t("voiceAlreadyStarting"));
  }
}

function formatRelativeDate(value) {
  const time = new Date(value).getTime();
  if (!Number.isFinite(time)) return t("recent");

  const diff = Math.max(0, Date.now() - time);
  const minute = 60 * 1000;
  const hour = 60 * minute;
  const day = 24 * hour;

  if (diff < minute) return t("justNow");
  if (diff < hour) return t("minAgo", { count: Math.floor(diff / minute) });
  if (diff < day) return t("hrAgo", { count: Math.floor(diff / hour) });
  return t("dAgo", { count: Math.floor(diff / day) });
}

function recentSettingsSummary(settings = DEFAULT_TRIP_SETTINGS) {
  const tripSettings = normalizeTripSettings(settings);
  return `${tripSettings.days}d - ${tripSettings.travelers} ${t(
    tripSettings.travelers === 1 ? "traveler" : "travelersLower"
  )} - ${translatedBudget(tripSettings.budget)}`;
}

function renderRecents() {
  if (!recentsList || !recentsCount) return;

  recentsCount.textContent = String(sessions.length);
  recentsList.innerHTML = "";

  if (!sessions.length) {
    const empty = document.createElement("p");
    empty.className = "recents-empty";
    empty.textContent = t("noRecentChats");
    recentsList.appendChild(empty);
    return;
  }

  sessions.forEach((session) => {
    const row = document.createElement("div");
    row.className = [
      "recent-row",
      session.id === currentSessionId ? "active" : "",
      session.pinned ? "pinned" : "",
    ]
      .filter(Boolean)
      .join(" ");
    row.dataset.pinnedLabel = t("pinned");

    const button = document.createElement("button");
    button.className = "recent-item";
    button.type = "button";

    const title = document.createElement("span");
    title.className = "recent-title";
    title.textContent = session.title || t("untitledTrip");

    const date = document.createElement("small");
    date.textContent = `${formatRelativeDate(session.updatedAt)} - ${recentSettingsSummary(session.settings)}`;

    const menuButton = document.createElement("button");
    menuButton.className = "recent-menu-button";
    menuButton.type = "button";
    menuButton.setAttribute("aria-label", t("optionsFor", { title: session.title || t("untitledTrip") }));
    menuButton.innerHTML = iconSvg("more");

    const deleteButton = document.createElement("button");
    deleteButton.className = "recent-delete-button";
    deleteButton.type = "button";
    deleteButton.setAttribute("aria-label", `${t("deleteChat")}: ${session.title || t("untitledTrip")}`);
    deleteButton.title = t("deleteChat");
    deleteButton.innerHTML = iconSvg("trash");

    button.appendChild(title);
    button.appendChild(date);
    button.addEventListener("click", () => loadSession(session.id));
    menuButton.addEventListener("click", (event) => {
      event.stopPropagation();
      openRecentMenu(session.id, menuButton);
    });
    deleteButton.addEventListener("click", (event) => {
      event.stopPropagation();
      deleteSession(session.id);
    });

    row.appendChild(button);
    row.appendChild(menuButton);
    row.appendChild(deleteButton);
    recentsList.appendChild(row);
  });
}

function ensureRecentMenu() {
  if (recentMenu) return recentMenu;

  recentMenu = document.createElement("div");
  recentMenu.className = "recent-actions-menu";
  recentMenu.hidden = true;
  recentMenu.setAttribute("role", "menu");
  document.body.appendChild(recentMenu);
  return recentMenu;
}

function actionMenuButton(action, label, iconName, extraClass = "") {
  const button = document.createElement("button");
  button.className = `recent-action ${extraClass}`.trim();
  button.type = "button";
  button.dataset.action = action;
  button.setAttribute("role", "menuitem");
  button.innerHTML = `${iconSvg(iconName)}<span>${escapeHtml(label)}</span>`;
  return button;
}

function openRecentMenu(sessionId, anchor) {
  const session = sessions.find((item) => item.id === sessionId);
  if (!session) return;

  const menu = ensureRecentMenu();
  activeMenuSessionId = sessionId;

  menu.replaceChildren(
    actionMenuButton("share", t("share"), "share"),
    actionMenuButton("rename", t("rename"), "rename"),
    document.createElement("hr"),
    actionMenuButton("pin", session.pinned ? t("unpinChat") : t("pinChat"), "pin"),
    actionMenuButton("delete", t("delete"), "trash", "danger")
  );
  menu.querySelector("hr").className = "recent-action-separator";

  menu.querySelector('[data-action="share"]').addEventListener("click", () => shareSession(sessionId));
  menu.querySelector('[data-action="rename"]').addEventListener("click", () => openRenameDialog(sessionId));
  menu.querySelector('[data-action="pin"]').addEventListener("click", () => togglePinSession(sessionId));
  menu.querySelector('[data-action="delete"]').addEventListener("click", () => deleteSession(sessionId));

  document.querySelectorAll(".recent-row.menu-open").forEach((row) => row.classList.remove("menu-open"));
  anchor.closest(".recent-row")?.classList.add("menu-open");

  menu.hidden = false;
  positionRecentMenu(anchor);
}

function positionRecentMenu(anchor) {
  if (!recentMenu || recentMenu.hidden) return;

  const rect = anchor.getBoundingClientRect();
  const menuRect = recentMenu.getBoundingClientRect();
  const gap = 8;
  const preferredLeft = rect.right + gap;
  const fallbackLeft = rect.left - menuRect.width - gap;
  const left =
    preferredLeft + menuRect.width <= window.innerWidth - 10
      ? preferredLeft
      : Math.max(10, fallbackLeft);
  const top = Math.min(Math.max(10, rect.top - 8), window.innerHeight - menuRect.height - 10);

  recentMenu.style.left = `${left}px`;
  recentMenu.style.top = `${top}px`;
}

function closeRecentMenu() {
  if (recentMenu) {
    recentMenu.hidden = true;
  }
  activeMenuSessionId = null;
  document.querySelectorAll(".recent-row.menu-open").forEach((row) => row.classList.remove("menu-open"));
}

function shareSession(sessionId) {
  const session = sessions.find((item) => item.id === sessionId);
  if (!session) return;

  closeRecentMenu();
  openShareDialog({
    history: sessionMessages(session),
    title: session.title,
    settings: session.settings,
  });
}

function openRenameDialog(sessionId) {
  const session = sessions.find((item) => item.id === sessionId);
  if (!session || !renameOverlay || !renameInput) return;

  closeRecentMenu();
  renameSessionId = sessionId;
  renameInput.value = session.title || t("untitledTrip");
  renameOverlay.hidden = false;
  window.setTimeout(() => {
    renameInput.focus();
    renameInput.select();
  }, 0);
}

function closeRenameDialog() {
  if (!renameOverlay) return;
  renameOverlay.hidden = true;
  renameSessionId = null;
}

function renameActiveSession(event) {
  event.preventDefault();
  if (!renameSessionId) return;

  const nextTitle = renameInput.value.replace(/\s+/g, " ").trim();
  if (!nextTitle) {
    renameInput.focus();
    return;
  }

  const session = sessions.find((item) => item.id === renameSessionId);
  if (!session) return;

  session.title = nextTitle;
  session.renamed = true;
  saveSessions();
  renderRecents();
  closeRenameDialog();
}

function togglePinSession(sessionId) {
  const session = sessions.find((item) => item.id === sessionId);
  if (!session) return;

  session.pinned = !session.pinned;
  saveSessions();
  renderRecents();
  closeRecentMenu();
}

function resetCurrentChatView() {
  history = [];
  clearPendingAttachments();
  writeHistoryOnly();
  currentSessionId = createSessionId();
  localStorage.setItem(currentSessionKey, currentSessionId);
  applyTripSettings({ ...DEFAULT_TRIP_SETTINGS, language: currentLanguage });
  setSignal(routeSignal, t("waitingDestination"));
  setSignal(weatherSignal, t("weatherAvailable"));
  setSignal(locationSignal, t("publicGeodata"));
  renderWelcome();
  renderRecents();
  messageInput.focus();
}

function clearCurrentChat() {
  closeRecentMenu();
  clearPendingAttachments();
  const hadSavedSession = Boolean(findCurrentSession());
  history = [];
  writeHistoryOnly();
  saveCurrentSession({
    force: hadSavedSession || !isDefaultTripSettings(readTripSettings()),
    keepEmpty: hadSavedSession,
  });
  setSignal(routeSignal, t("waitingDestination"));
  setSignal(weatherSignal, t("weatherAvailable"));
  setSignal(locationSignal, t("publicGeodata"));
  renderWelcome();
  renderRecents();

  if (isMobileLayout()) {
    closeSidebar();
  }

  messageInput.focus();
}

function deleteSession(sessionId) {
  const deletingCurrent = sessionId === currentSessionId;
  sessions = sessions.filter((session) => session.id !== sessionId);
  saveSessions();
  closeRecentMenu();

  if (!deletingCurrent) {
    renderRecents();
    return;
  }

  resetCurrentChatView();
}

function loadSession(sessionId, { preserveCurrent = true } = {}) {
  const session = sessions.find((item) => item.id === sessionId);
  if (!session) return;

  if (preserveCurrent && history.length && currentSessionId !== sessionId) {
    saveCurrentSession();
  }

  currentSessionId = session.id;
  localStorage.setItem(currentSessionKey, currentSessionId);
  history = sessionMessages(session);
  applyTripSettings(session.settings);
  writeHistoryOnly();
  renderHistory();
  renderRecents();
  closeRecentMenu();

  if (isMobileLayout()) {
    closeSidebar();
  }
  messageInput.focus();
}

function startNewChat() {
  if (history.length || findCurrentSession()) {
    saveCurrentSession();
  }

  history = [];
  clearPendingAttachments();
  writeHistoryOnly();
  currentSessionId = createSessionId();
  localStorage.setItem(currentSessionKey, currentSessionId);
  applyTripSettings({ ...DEFAULT_TRIP_SETTINGS, language: currentLanguage });
  setSignal(routeSignal, t("waitingDestination"));
  setSignal(weatherSignal, t("weatherAvailable"));
  setSignal(locationSignal, t("publicGeodata"));
  renderWelcome();
  renderRecents();
  messageInput.focus();
}

function encodeShareData(value) {
  const bytes = new TextEncoder().encode(value);
  let binary = "";
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function decodeShareData(value) {
  const base64 = value.replace(/-/g, "+").replace(/_/g, "/");
  const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), "=");
  const binary = atob(padded);
  const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

const SHORT_SHARE_ID_PATTERN = /^[A-Za-z0-9]{4,32}$/;

function appBaseUrl() {
  if (window.location.protocol === "file:") return "http://127.0.0.1:8000";
  return window.location.origin;
}

function legacyShareLink(items = history, title = "") {
  const shareHistory = normalizeMessages(items).slice(-MAX_HISTORY_MESSAGES);
  const payload = {
    version: APP_VERSION,
    title: title || (shareHistory.length ? titleFromHistory(shareHistory) : "Eco Travel Planner chat"),
    createdAt: new Date().toISOString(),
    history: shareHistory,
    settings: readTripSettings(),
  };
  const encoded = encodeShareData(JSON.stringify(payload));
  return `${appBaseUrl()}/${SHARE_HASH_PREFIX}${encoded}`;
}

function sharePayload(options = {}) {
  const shareHistory = normalizeMessages(options.history || history).slice(-MAX_HISTORY_MESSAGES);
  return {
    version: APP_VERSION,
    title: options.title || (shareHistory.length ? titleFromHistory(shareHistory) : "Eco Travel Planner chat"),
    createdAt: options.createdAt || new Date().toISOString(),
    history: shareHistory,
    settings: normalizeTripSettings(options.settings || findCurrentSession()?.settings || readTripSettings()),
  };
}

async function createShortShareLink(options = {}) {
  const payload = sharePayload(options);

  if (!payload.history.length) {
    throw new Error(t("shareNoContent"));
  }

  const response = await fetch(`${API_BASE}/api/shares`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok || !data.url) {
    throw new Error(detailToText(data.detail) || t("shareCreateFailed"));
  }

  return data;
}

function shortShareIdFromLocation() {
  const pathMatch = window.location.pathname.match(/^\/share\/([A-Za-z0-9]{4,32})\/?$/);
  if (pathMatch) return pathMatch[1];

  const queryId = new URLSearchParams(window.location.search).get("share");
  if (queryId && SHORT_SHARE_ID_PATTERN.test(queryId)) return queryId;

  if (window.location.hash.startsWith(SHARE_HASH_PREFIX)) {
    const value = window.location.hash.slice(SHARE_HASH_PREFIX.length);
    if (SHORT_SHARE_ID_PATTERN.test(value)) return value;
  }

  return "";
}

function loadSharedPayload(payload, { cleanLegacyUrl = false } = {}) {
  const sharedHistory = normalizeMessages(payload.history).slice(-MAX_HISTORY_MESSAGES);
  if (!sharedHistory.length) return false;

  if (history.length) {
    saveCurrentSession();
  }

  currentSessionId = createSessionId();
  localStorage.setItem(currentSessionKey, currentSessionId);
  history = sharedHistory;

  if (payload.settings) {
    applyTripSettings(payload.settings);
  }

  writeHistoryOnly();
  saveCurrentSession();

  if (cleanLegacyUrl) {
    window.history.replaceState(null, document.title, `${window.location.pathname}${window.location.search}`);
  }

  return true;
}

async function loadShortShare(shareId) {
  const response = await fetch(`${API_BASE}/api/shares/${encodeURIComponent(shareId)}`);
  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(detailToText(payload.detail) || t("shareCreateFailed"));
  }

  return loadSharedPayload(payload);
}

function tryLoadLegacySharedConversation() {
  if (!window.location.hash.startsWith(SHARE_HASH_PREFIX)) return false;

  const encoded = window.location.hash.slice(SHARE_HASH_PREFIX.length);
  if (SHORT_SHARE_ID_PATTERN.test(encoded)) return false;

  try {
    const payload = JSON.parse(decodeShareData(encoded));
    return loadSharedPayload(payload, { cleanLegacyUrl: true });
  } catch (error) {
    console.warn("Could not load legacy shared conversation.", error);
    return false;
  }
}

async function tryLoadSharedConversation() {
  const shareId = shortShareIdFromLocation();
  if (shareId) {
    try {
      return await loadShortShare(shareId);
    } catch (error) {
      console.warn("Could not load short share link.", error);
      return false;
    }
  }

  return tryLoadLegacySharedConversation();
}

async function openShareDialog(options = {}) {
  if (!shareOverlay || !shareLinkInput) return;

  shareOverlay.hidden = false;
  shareLinkInput.value = "";
  shareLinkInput.placeholder = t("creatingShareLink");
  copyShareButton.disabled = true;
  copyShareButton.textContent = t("creatingShareLink");

  try {
    const data = await createShortShareLink(options);
    const link = data.url;
    const title = options.title || titleFromHistory(options.history || history);

    shareLinkInput.value = link;
    shareLinkInput.placeholder = "";
    copyShareButton.disabled = false;

    try {
      await writeClipboardText(link);
      copyShareButton.textContent = t("shareLinkCopied");
    } catch {
      copyShareButton.textContent = t("copyLink");
    }

    if (navigator.share && isMobileLayout()) {
      try {
        await navigator.share({ title, text: link, url: link });
      } catch (error) {
        if (!isShareCancellation(error)) {
          console.warn("Native sharing failed.", error);
        }
      }
    }

    window.setTimeout(() => {
      if (!copyShareButton.disabled) copyShareButton.textContent = t("copyLink");
    }, 1800);

    window.setTimeout(() => {
      shareLinkInput.focus();
      shareLinkInput.select();
    }, 0);
  } catch (error) {
    console.warn("Could not create share link.", error);
    shareLinkInput.placeholder = "";
    shareLinkInput.value = error?.message || t("shareCreateFailed");
    copyShareButton.textContent = t("shareCreateFailed");
    copyShareButton.disabled = true;
  }
}

function closeShareDialog() {
  if (!shareOverlay) return;
  shareOverlay.hidden = true;
  shareButton?.focus();
}

async function copyShareLink() {
  const link = shareLinkInput.value;
  if (!link || copyShareButton.disabled) return;

  try {
    await writeClipboardText(link);
    copyShareButton.textContent = t("shareLinkCopied");
  } catch {
    shareLinkInput.focus();
    shareLinkInput.select();
    document.execCommand("copy");
    copyShareButton.textContent = t("copied");
  }

  window.setTimeout(() => {
    if (!copyShareButton.disabled) copyShareButton.textContent = t("copyLink");
  }, 1400);
}

function isMobileLayout() {
  return window.matchMedia("(max-width: 760px)").matches;
}

function setSidebarCollapsed(collapsed) {
  document.body.classList.toggle("sidebar-collapsed", collapsed);
  if (!isMobileLayout()) {
    localStorage.setItem(sidebarStateKey, collapsed ? "true" : "false");
  }
}

function openSidebar() {
  setSidebarCollapsed(false);
  if (isMobileLayout()) {
    document.body.classList.add("sidebar-open");
  }
}

function closeSidebar() {
  if (isMobileLayout()) {
    document.body.classList.remove("sidebar-open");
    return;
  }
  setSidebarCollapsed(true);
}

function translateStaticUI() {
  document.querySelectorAll("[data-i18n]").forEach((node) => {
    node.textContent = t(node.dataset.i18n);
  });

  document.querySelectorAll("[data-i18n-title]").forEach((node) => {
    node.title = t(node.dataset.i18nTitle);
  });

  document.querySelectorAll("[data-i18n-aria-label]").forEach((node) => {
    node.setAttribute("aria-label", t(node.dataset.i18nAriaLabel));
  });

  document.querySelectorAll("[data-i18n-placeholder]").forEach((node) => {
    node.setAttribute("placeholder", t(node.dataset.i18nPlaceholder));
  });

  styleButtons.forEach((button) => {
    button.title = translatedTravelStyle(button.dataset.value);
  });

  if (pendingAttachments.length && messageInput && !messageInput.value.trim()) {
    messageInput.placeholder = t("addTravelFile");
  }

  if (appVersionLabel) {
    appVersionLabel.textContent = `Eco Travel Planner v${APP_VERSION}`;
  }

  setStatus(statusChip?.classList.contains("loading") ? t("thinking") : t("ready"), Boolean(statusChip?.classList.contains("loading")));
}

function renderLanguageMenu() {
  if (!languageMenu) return;

  languageMenu.innerHTML = "";
  LANGUAGE_OPTIONS.forEach((language) => {
    const button = document.createElement("button");
    const selected = language.value === currentLanguage;
    button.type = "button";
    button.className = `language-option${selected ? " active" : ""}`;
    button.dataset.language = language.value;
    button.setAttribute("role", "menuitemradio");
    button.setAttribute("aria-checked", String(selected));
    button.innerHTML = `
      <span>${escapeHtml(language.nativeLabel)}</span>
      <small>${escapeHtml(selected ? t("selectedLanguage", { language: language.nativeLabel }) : language.label)}</small>
    `;
    button.addEventListener("click", () => {
      setLanguage(language.value, { persist: true, render: true, saveSettings: true });
      closeLanguageMenu();
    });
    languageMenu.appendChild(button);
  });
}

function closeLanguageMenu() {
  if (!languageMenu || !languageToggleButton) return;
  languageMenu.hidden = true;
  languageToggleButton.setAttribute("aria-expanded", "false");
}

function openLanguageMenu() {
  if (!languageMenu || !languageToggleButton) return;
  renderLanguageMenu();
  languageMenu.hidden = false;
  languageToggleButton.setAttribute("aria-expanded", "true");
}

function toggleLanguageMenu() {
  if (!languageMenu) return;
  if (languageMenu.hidden) {
    openLanguageMenu();
    return;
  }
  closeLanguageMenu();
}

function setLanguage(language, { persist = false, render = false, saveSettings = false } = {}) {
  const nextLanguage = normalizeLanguage(language);
  const meta = languageMeta(nextLanguage);

  currentLanguage = nextLanguage;
  document.documentElement.lang = meta.code;
  document.documentElement.dir = meta.dir;
  document.documentElement.dataset.language = nextLanguage.toLowerCase();

  if (languageCode) {
    languageCode.textContent = meta.short;
  }

  if (persist) {
    localStorage.setItem(languageKey, nextLanguage);
  }

  translateStaticUI();
  renderLanguageMenu();
  setTheme(activeTheme(), { persist: false });

  if (languageToggleButton) {
    const languageLabel = t("selectedLanguage", { language: meta.nativeLabel });
    languageToggleButton.setAttribute("aria-label", languageLabel);
    languageToggleButton.title = languageLabel;
  }

  if (recognition) {
    recognition.lang = speechLanguage();
  }

  if (saveSettings && !isApplyingSession) {
    saveTripSettingsChange();
  }

  if (render) {
    renderHistory();
    renderRecents();
  }
}

function setupLanguagePreference() {
  setLanguage(currentLanguage, { persist: false, render: false, saveSettings: false });

  languageToggleButton?.addEventListener("click", (event) => {
    event.stopPropagation();
    toggleLanguageMenu();
  });
}

function systemThemePreference() {
  return window.matchMedia?.("(prefers-color-scheme: light)").matches ? "light" : "dark";
}

function storedThemePreference() {
  try {
    const saved = localStorage.getItem(themeKey);
    return saved === "light" || saved === "dark" ? saved : null;
  } catch {
    return null;
  }
}

function activeTheme() {
  const current = document.documentElement.dataset.theme;
  return current === "light" || current === "dark" ? current : systemThemePreference();
}

function setTheme(theme, { persist = false } = {}) {
  const nextTheme = theme === "light" ? "light" : "dark";
  const nextAction = nextTheme === "light" ? "dark" : "light";

  document.documentElement.dataset.theme = nextTheme;
  document.documentElement.style.colorScheme = nextTheme;
  themeColorMeta?.setAttribute("content", themeColors[nextTheme]);

  if (persist) {
    localStorage.setItem(themeKey, nextTheme);
  }

  if (themeToggleButton) {
    const label = t(nextAction === "light" ? "switchToLightMode" : "switchToDarkMode");
    themeToggleButton.setAttribute("aria-label", label);
    themeToggleButton.title = label;
  }
}

function setupThemePreference() {
  setTheme(storedThemePreference() || activeTheme(), { persist: false });

  themeToggleButton?.addEventListener("click", () => {
    setTheme(activeTheme() === "light" ? "dark" : "light", { persist: true });
  });

  const mediaQuery = window.matchMedia?.("(prefers-color-scheme: light)");
  const handleSystemThemeChange = (event) => {
    if (!storedThemePreference()) {
      setTheme(event.matches ? "light" : "dark", { persist: false });
    }
  };

  if (mediaQuery?.addEventListener) {
    mediaQuery.addEventListener("change", handleSystemThemeChange);
  } else {
    mediaQuery?.addListener?.(handleSystemThemeChange);
  }
}

function saveTripSettingsChange() {
  if (isApplyingSession) return;

  const shouldSaveEmpty =
    Boolean(findCurrentSession()) ||
    history.length > 0 ||
    !isDefaultTripSettings(readTripSettings());

  saveCurrentSession({ force: shouldSaveEmpty });
  renderRecents();
}

function adjustStepper(button) {
  const input = document.getElementById(button.dataset.stepperTarget);
  if (!input) return;

  const step = Number(button.dataset.step) || 0;
  const min = Number(input.min);
  const max = Number(input.max);
  const current = Number(input.value) || Number(input.defaultValue) || 0;
  const next = Math.min(
    Number.isFinite(max) ? max : current + step,
    Math.max(Number.isFinite(min) ? min : current + step, current + step)
  );

  input.value = String(next);
  input.dispatchEvent(new Event("change", { bubbles: true }));
}

function resetTripSettings() {
  applyTripSettings({ ...DEFAULT_TRIP_SETTINGS, language: currentLanguage }, { applyLanguage: false });
  saveTripSettingsChange();
  messageInput.focus();
}

function registerServiceWorker() {
  if (!("serviceWorker" in navigator) || window.location.protocol === "file:") {
    return;
  }

  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/service-worker.js")
      .catch((error) => {
        console.warn("Service worker registration failed.", error);
      });
  });
}

styleButtons.forEach((button) => {
  button.title = translatedTravelStyle(button.dataset.value);
  button.addEventListener("click", () => {
    travelStyle = button.dataset.value;
    styleButtons.forEach((item) => item.classList.toggle("active", item === button));
    saveTripSettingsChange();
  });
});

sustainabilityInput.addEventListener("input", () => {
  sustainabilityValue.textContent = sustainabilityInput.value;
  saveTripSettingsChange();
});

budgetInput.addEventListener("change", saveTripSettingsChange);
daysInput.addEventListener("change", saveTripSettingsChange);
travelersInput.addEventListener("change", saveTripSettingsChange);
resetSettingsButton?.addEventListener("click", resetTripSettings);
stepperButtons.forEach((button) => {
  button.addEventListener("click", () => adjustStepper(button));
});

addContextButton?.addEventListener("click", (event) => {
  event.stopPropagation();
  toggleAddFilesMenu();
});

chooseFilesButton?.addEventListener("click", () => {
  toggleAddFilesMenu(false);
  fileInput?.click();
});

fileInput?.addEventListener("change", async (event) => {
  await addFiles(event.target.files);
});

voiceButton?.addEventListener("click", toggleVoiceInput);

messageInput.addEventListener("input", autoResizeInput);
messageInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter" && !event.shiftKey) {
    event.preventDefault();
    form.requestSubmit();
  }
});

newChatButton?.addEventListener("click", startNewChat);
clearHistoryButton?.addEventListener("click", clearCurrentChat);

recentsToggleButton?.addEventListener("click", () => {
  const shouldOpen = recentsList.hidden;
  recentsList.hidden = !shouldOpen;
  recentsToggleButton.setAttribute("aria-expanded", String(shouldOpen));
  if (shouldOpen) renderRecents();
});

shareButton?.addEventListener("click", () => openShareDialog());
closeShareButton?.addEventListener("click", closeShareDialog);
copyShareButton?.addEventListener("click", copyShareLink);
renameForm?.addEventListener("submit", renameActiveSession);
closeRenameButton?.addEventListener("click", closeRenameDialog);
cancelRenameButton?.addEventListener("click", closeRenameDialog);
shareOverlay?.addEventListener("click", (event) => {
  if (event.target === shareOverlay) {
    closeShareDialog();
  }
});
renameOverlay?.addEventListener("click", (event) => {
  if (event.target === renameOverlay) {
    closeRenameDialog();
  }
});

document.addEventListener("click", (event) => {
  if (recentMenu?.hidden !== false) return;
  if (recentMenu.contains(event.target) || event.target.closest(".recent-menu-button")) return;
  closeRecentMenu();
});

document.addEventListener("click", (event) => {
  if (addFilesMenu?.hidden !== false) return;
  if (addFilesMenu.contains(event.target) || event.target.closest("#addContextButton")) return;
  toggleAddFilesMenu(false);
});

document.addEventListener("click", (event) => {
  if (languageMenu?.hidden !== false) return;
  if (languageMenu.contains(event.target) || event.target.closest("#languageToggleButton")) return;
  closeLanguageMenu();
});

document.addEventListener("click", (event) => {
  if (!isMobileLayout() || !document.body.classList.contains("sidebar-open")) return;
  if (event.target.closest(".sidebar") || event.target.closest("#openSidebarButton")) return;
  closeSidebar();
});

window.addEventListener("keydown", (event) => {
  if (event.key !== "Escape") return;

  if (!shareOverlay?.hidden) closeShareDialog();
  if (!renameOverlay?.hidden) closeRenameDialog();
  if (recentMenu?.hidden === false) closeRecentMenu();
  if (addFilesMenu?.hidden === false) toggleAddFilesMenu(false);
  if (languageMenu?.hidden === false) closeLanguageMenu();
  if (document.body.classList.contains("sidebar-open")) closeSidebar();
});

window.addEventListener("scroll", () => {
  if (recentMenu?.hidden === false) {
    closeRecentMenu();
  }
  if (languageMenu?.hidden === false) {
    closeLanguageMenu();
  }
}, true);

if (localStorage.getItem(sidebarStateKey) === "true" && !isMobileLayout()) {
  setSidebarCollapsed(true);
}

openSidebarButton?.addEventListener("click", () => {
  if (document.body.classList.contains("sidebar-collapsed")) {
    openSidebar();
  } else if (isMobileLayout()) {
    document.body.classList.add("sidebar-open");
  } else {
    closeSidebar();
  }
});

closeSidebarButton?.addEventListener("click", closeSidebar);

window.addEventListener("resize", () => {
  closeRecentMenu();
  closeLanguageMenu();
  if (!isMobileLayout()) {
    document.body.classList.remove("sidebar-open");
  }
});

window.addEventListener("afterprint", clearTripPrintTarget);

window.addEventListener("hashchange", async () => {
  if (await tryLoadSharedConversation()) {
    bootstrapSessions();
    renderHistory();
  }
});

async function initializeApp() {
  await tryLoadSharedConversation();
  bootstrapSessions();
  renderHistory();
  autoResizeInput();
}

form.addEventListener("submit", submitPlan);
setupLanguagePreference();
setupThemePreference();
registerServiceWorker();
recognition = setupVoiceRecognition();
initializeApp();
