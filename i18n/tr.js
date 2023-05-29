const Enum = require("../config/Enum");

module.exports = {
  COMMON: {
    VALIDATION_ERROR_TITLE: "Doğrulama Hatası",
    ALREADY_EXIST: "Zaten Var!",
    UNKNOWN_ERROR: "Bilinmeyen Hata!",
    FIELD_MUST_BE_FILLED: "{} lanı doldurulması zorunludur!",

    LIST_SUCCESSFUL_TITLE: "Listeleme Başarılı",
    LIST_SUCCESSFUL_DESC:
      "{} kayıtlarını listeleme işlemi başarılı bir şekilde yapıldı.",

    ADD_SUCCESSFUL_TITLE: "Ekleme Başarılı",
    ADD_SUCCESSFUL_DESC: "{} ekleme işlemi başarılı bir şekilde yapıldı.",

    UPDATE_SUCCESSFUL_TITLE: "Güncelleme Başarılı",
    UPDATE_SUCCESSFUL_DESC:
      "{} güncelleme işlemi başarılı bir şekilde yapıldı.",

    DELETE_SUCCESSFUL_TITLE: "Silme Başarılı",
    DELETE_SUCCESSFUL_DESC: "{} silme işlemi başarılı bir şekilde yapıldı.",

    REPORT_SUCCESSFUL_TITLE: "Raporlama Başarılı",
    REPORT_SUCCESSFUL_DESC: "{} raporlama işlemi başarılı bir şekilde yapıldı.",

    PRINT_SUCCESSFUL_TITLE: "Yazdırma Başarılı",
    PRINT_SUCCESSFUL_DESC: "{} yazdırma işlemi başarılı bir şekilde yapıldı",
  },
  USER: {
    IS_EMAIL:
      "Email alanına girilen değer geçerli bir eposta adresi olmalıdır.",
    PASSWORD_LENGTH: `Parola uzunluğu ${Enum.PASS_LENGTH} karakterden daha az olamaz.`,
    ROLE_VALIDATION: "Rol alanı doldurulması zorunludur ve bir dizi olmalıdır.",
  },
  AUTH: {
    VALIDATE_FIELD_BEFORE_AUTH: "Email yada şifre hatalı.",
    AUTH_SUCCESSFUL_TITLE: "Kimlik Doğrulama Başarılı",
    AUTH_SUCCESSFUL_DESC:
      "Kimlik Doğrulama işlemi başarılı bir şekilde gerçekleştirildi.",
    UNAUTHORIZED_ACCESS_TITLE: "Yetkisiz Erişim",
    UNAUTHORIZED_ACCESS_DESC:
      "Bu işlemi gerçekleştirmeye yetkili değilsiniz, sistem yöneticisine başvurunuz.",
  },
  PARAMS: {
    ID: "_id",
    NAME: "ad",
    FIRST_NAME: "ad",
    LAST_NAME: "soyad",
    EMAIL: "email",
    PASSWORD: "parola",
    PERMISSION: "izin",
    ROLE_NAME: "role adı",
  },
  ENDPOINTS: {
    CATEGORIES: "kategoriler",
    CATEGORY: "kategori",
    USER_ROLES: "kullanıcı rolleri",
    USER_ROLE: "kullanıcı rolü",
    ROLES: "roller",
    ROLE: "rol",
    USERS: "kullanıcılar",
    USER: "kullanıcı",
    AUDIT_LOGS: "denetim logları",
    AUDIT_LOG: "denetim logu",
  },
  PROCESSES_TYPES: {
    LIST: "listele",
    CREATE: "ekle",
    UPDATE: "güncelle",
    DELETE: "sil",
    REPORT: "rapor",
    PRINT: "yazdır",
  },
};
