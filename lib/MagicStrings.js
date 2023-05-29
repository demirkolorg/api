const Enum = require("../config/Enum");

module.exports = {
  Genel: {
    zatenVarTitle: "Girilen Değer Zaten Var",
    zatenVarDesc:
      "Girilen değerde br alan zaten var, lütfen farklı bir değer girmeyi deneyin.",
  },
  Categories: {
    listelemeBasariliTitle: "Kategori Listeleme Başarılı",
    listelemeBasariliDesc:
      "Kategori listeleme işlemi başarılı bir şekilde yapıldı.",

    nameValidationErrorMsg: "Validasyon hatası",
    nameValidationErrorDesc: "Name alanı doldurulması zorunludur.",
    eklemeBasariliTitle: "Kategori Ekleme Başarılı",
    eklemeBasariliDesc: "Kategori ekleme işlemi başarılı bir şekilde yapıldı.",

    updateidValidationErrorMsg: "Validasyon hatası",
    updateidValidationErrorDesc: "id alanı doldurulması zorunludur.",
    guncellemeBasariliTitle: "Kategori Güncelleme Başarılı",
    guncellemeBasariliDesc:
      "Kategori güncelleme işlemi başarılı bir şekilde yapıldı.",

    deleteidValidationErrorMsg: "Validasyon hatası",
    deleteidValidationErrorDesc: "id alanı doldurulması zorunludur.",
    silmeBasariliTitle: "Kategori Silme Başarılı",
    silmeBasariliDesc: "Kategori silme işlemi başarılı bir şekilde yapıldı.",
  },
  Roles: {
    listelemeBasariliTitle: "Rol Listeleme Başarılı",
    listelemeBasariliDesc: "Rol listeleme işlemi başarılı bir şekilde yapıldı.",

    nameValidationErrorMsg: "Validasyon hatası",
    nameValidationErrorDesc: "Rol adı alanı doldurulması zorunludur.",
    
    permissionValidationErrorMsg: "Validasyon hatası",
    permissionValidationErrorDesc: "Permission alanı doldurulması zorunludur.",
    eklemeBasariliTitle: "Rol Ekleme Başarılı",
    eklemeBasariliDesc: "Rol ekleme işlemi başarılı bir şekilde yapıldı.",

    idValidationErrorMsg: "Validasyon hatası",
    idValidationErrorDesc: "id alanı doldurulması zorunludur.",
    updatepermissionValidationErrorMsg: "Validasyon hatası",
    updatepermissionValidationErrorDesc:
      "Permission alanı doldurulması zorunludur.",
    guncellemeBasariliTitle: "Rol Güncelleme Başarılı",
    guncellemeBasariliDesc:
      "Rol güncelleme işlemi başarılı bir şekilde yapıldı.",

    deleteidValidationErrorMsg: "Validasyon hatası",
    deleteidValidationErrorDesc: "id alanı doldurulması zorunludur.",
    silmeBasariliTitle: "Rol Silme Başarılı",
    silmeBasariliDesc: "Rol silme işlemi başarılı bir şekilde yapıldı.",
  },
  Users: {
    listelemeBasariliTitle: "Kullanıcı Listeleme Başarılı",
    listelemeBasariliDesc:
      "Kullanıcı listeleme işlemi başarılı bir şekilde yapıldı.",

    first_nameValidationErrorMsg: "Validasyon hatası",
    first_nameValidationErrorDesc: "Ad alanı doldurulması zorunludur.",
    last_nameValidationErrorMsg: "Validasyon hatası",
    last_nameValidationErrorDesc: "Soyad alanı doldurulması zorunludur.",
    emailValidationErrorMsg: "Validasyon hatası",
    emailValidationErrorDesc: "Email alanı doldurulması zorunludur.",
    isEmailValidationErrorMsg: "Validasyon hatası",
    isEmailValidationErrorDesc:
      "Email alanına girilen değer geçerli bir eposta adresi olmalıdır.",
    passwordValidationErrorMsg: "Validasyon hatası",
    passwordValidationErrorDesc: "Parola alanı doldurulması zorunludur.",
    passwordLenghtValidationErrorMsg: "Validasyon hatası",
    passwordLenghtValidationErrorDesc: `Parola uzunluğu ${Enum.PASS_LENGTH} karakterden daha az olamaz.`,
    rolesValidationErrorMsg: "Validasyon hatası",
    rolesValidationErrorDesc:
      "Rol alanı doldurulması zorunludur ve bir dizi olmalıdır.",
    eklemeBasariliTitle: "Kullanıcı Ekleme Başarılı",
    eklemeBasariliDesc: "Kullanıcı ekleme işlemi başarılı bir şekilde yapıldı.",

    updateidValidationErrorMsg: "Validasyon hatası",
    updateidValidationErrorDesc: "id alanı doldurulması zorunludur.",
    guncellemeBasariliTitle: "Kullanıcı Güncelleme Başarılı",
    guncellemeBasariliDesc:
      "Kullanıcı güncelleme işlemi başarılı bir şekilde yapıldı.",

    deleteidValidationErrorMsg: "Validasyon hatası",
    deleteidValidationErrorDesc: "id alanı doldurulması zorunludur.",
    silmeBasariliTitle: "Kullanıcı Silme Başarılı",
    silmeBasariliDesc: "Kullanıcı silme işlemi başarılı bir şekilde yapıldı.",
  },
  AuditLogs: {
    listelemeBasariliTitle: "AuditLogs Listeleme Başarılı",
    listelemeBasariliDesc:
      "AuditLogs listeleme işlemi başarılı bir şekilde yapıldı.",

    nameValidationErrorMsg: "Validasyon hatası",
    nameValidationErrorDesc: "Name alanı doldurulması zorunludur.",
    eklemeBasariliTitle: "Kategori Ekleme Başarılı",
    eklemeBasariliDesc: "Kategori ekleme işlemi başarılı bir şekilde yapıldı.",

    updateidValidationErrorMsg: "Validasyon hatası",
    updateidValidationErrorDesc: "id alanı doldurulması zorunludur.",
    guncellemeBasariliTitle: "Kategori Güncelleme Başarılı",
    guncellemeBasariliDesc:
      "Kategori güncelleme işlemi başarılı bir şekilde yapıldı.",

    deleteidValidationErrorMsg: "Validasyon hatası",
    deleteidValidationErrorDesc: "id alanı doldurulması zorunludur.",
    silmeBasariliTitle: "Kategori Silme Başarılı",
    silmeBasariliDesc: "Kategori silme işlemi başarılı bir şekilde yapıldı.",
  },
  Auth: {
    validateFieldBeforeAuhtMsg: "Validation Error",
    validateFieldBeforeAuhtDesc: "Email yada şifre hatalı.",
    authBasariliMsg: "Auth Başarılı",
    authBasariliDesc: "Auth işlemi başarılı bir şekilde gerçekleştirildi.",
    yetkisizErisimMsg: "Yetkisiz Erişim",
    yetkisizErisimDsc:
      "Bu işlemi gerçekleştirmeye yetkili değilsiniz, sistem yöneticisine başvurunuz.",
  },
};
