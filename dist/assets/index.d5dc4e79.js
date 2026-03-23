const p = function polyfill() {
  const relList = document.createElement("link").relList;
  if (relList && relList.supports && relList.supports("modulepreload")) {
    return;
  }
  for (const link of document.querySelectorAll('link[rel="modulepreload"]')) {
    processPreload(link);
  }
  new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type !== "childList") {
        continue;
      }
      for (const node of mutation.addedNodes) {
        if (node.tagName === "LINK" && node.rel === "modulepreload")
          processPreload(node);
      }
    }
  }).observe(document, { childList: true, subtree: true });
  function getFetchOpts(script) {
    const fetchOpts = {};
    if (script.integrity)
      fetchOpts.integrity = script.integrity;
    if (script.referrerpolicy)
      fetchOpts.referrerPolicy = script.referrerpolicy;
    if (script.crossorigin === "use-credentials")
      fetchOpts.credentials = "include";
    else if (script.crossorigin === "anonymous")
      fetchOpts.credentials = "omit";
    else
      fetchOpts.credentials = "same-origin";
    return fetchOpts;
  }
  function processPreload(link) {
    if (link.ep)
      return;
    link.ep = true;
    const fetchOpts = getFetchOpts(link);
    fetch(link.href, fetchOpts);
  }
};
p();
var onsenui = "";
var onsenCssComponents_min = "";
var stylesheet = "";
var large = "";
var small = "";
var customico = "";
var rootPath = "https://armoniaestetica.com/";
var phpValidate = rootPath + "_sudiv3/ar_engine/login_validate_new_ios.php";
var SESSION_COOKIE_DAYS = 30;
var SESSION_COOKIE_KEYS = ["id_pat", "mail_pat", "pass_pat"];
var clickHandler = "ontouchstart" in document.documentElement ? "touchend" : "click";
var touchmoved;
if ("ontouchstart" in document.documentElement) {
  document.addEventListener("touchstart", function() {
  }, false);
}
function getLoginAcess(userCompanyData) {
  console.log(userCompanyData);
  var id_pat = userCompanyData[0];
  var mail_pat = userCompanyData[1];
  var pass_pat = userCompanyData[2];
  if (mail_pat == "" || mail_pat == null || mail_pat == "null" || mail_pat == void 0 || mail_pat == "undefined" || mail_pat == "u") {
    modal.hide();
    ons.notification.toast({ message: "Not user validate", timeout: 1e3 });
    $inputs.prop("disabled", false);
    $("#submit_login").html(login_btn_text);
  } else {
    localStorage.setItem("id_pat", id_pat);
    localStorage.getItem("id_pat");
    localStorage.setItem("mail_pat", mail_pat);
    localStorage.getItem("mail_pat");
    localStorage.setItem("pass_pat", pass_pat);
    localStorage.getItem("pass_pat");
    persistSessionCookies({
      id_pat,
      mail_pat,
      pass_pat
    });
    localStorage.setItem("fcm_sync_required", "1");
    setTimeout(function() {
      modal.hide();
    }, 2e3);
    setTimeout(function() {
      var url = "home.html";
      window.location.replace(url);
    }, 500);
  }
}
function setCookie(cname, cvalue, exdays) {
  var d = new Date();
  d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1e3);
  var expires = "expires=" + d.toUTCString();
  document.cookie = cname + "=" + encodeURIComponent(cvalue || "") + ";" + expires + ";path=/;SameSite=Lax";
}
function deleteCookie(cname) {
  document.cookie = cname + "=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;SameSite=Lax";
}
function persistSessionCookies(sessionData) {
  SESSION_COOKIE_KEYS.forEach(function(key) {
    if (!sessionData || sessionData[key] == null) {
      return;
    }
    setCookie(key, String(sessionData[key]), SESSION_COOKIE_DAYS);
  });
}
function clearSessionCookies() {
  SESSION_COOKIE_KEYS.forEach(function(key) {
    deleteCookie(key);
  });
}
function getLogOut() {
  var modal2 = document.querySelector("ons-modal");
  modal2.show();
  setTimeout(function() {
    modal2.hide();
  }, 2e3);
  setTimeout(function() {
    var url = "index.html";
    window.location.replace(url);
  }, 2e3);
}
var clickHandler = "ontouchstart" in document.documentElement ? "touchend" : "click";
var msgTimer;
$(document).on(clickHandler, "#submit_login", function() {
  $("#login_form").submit();
});
$("#forget_pass").bind(clickHandler, function(e) {
  if ($(this).data("request") == "0") {
    $(this).data("request", "1");
    $(this).html("Cancelar");
    $("#submit_login").html("Enviar");
    $("#login_user").attr("placeholder", "Capture su correo para recuperar password");
    $("#login_user").val("");
    showMsgError($(".error_login"), "Capture su correo electr\xC3\xB3nico:", "#FFF");
  } else {
    $(this).data("request", "0");
    $(this).html("Recuperar acceso");
    $("#submit_login").html("Ingresar");
    $("#login_user").attr("placeholder", "Correo");
  }
  $(this).toggleClass("cancel");
  $("#login_password_box").toggleClass("closed");
});
$(document).on("submit", "#login_form", function() {
  var modal2 = document.querySelector("ons-modal");
  var typeOfSubmit = 0;
  var lenUser;
  {
    var lenUser = $("#login_user").val().length >= 4 ? 1 : 0;
  }
  var lenPass = $("#login_password").val().length >= 4 ? 1 : 0;
  if (lenUser + lenPass == 2 || typeOfSubmit == 1) {
    var loginPath = phpValidate + "?method=validate_login";
    var request;
    if (request) {
      request.abort();
    }
    var $form = $(this);
    var $inputs2 = $form.find("input, select, button, textarea, checkbox");
    var serializedData = $form.serialize();
    $inputs2.prop("disabled", true);
    var login_btn_text2 = $("#submit_login").html();
    modal2.show();
    request = $.ajax({
      url: loginPath,
      type: "post",
      data: serializedData
    });
    request.done(function(response, textStatus, jqXHR) {
      switch (typeOfSubmit) {
        case 1:
          if (response !== "unsuccessful") {
            var request_response = $.parseJSON(response);
            var requestMsg = '<i class="fa fa-envelope" style="color:#83DF83;"></i> ' + request_response[0] + ', hemos enviado un correo a "' + request_response[1] + '"';
            ons.notification.toast({ message: requestMsg, timeout: 1e3 });
            $("#forget_pass").trigger("click");
            $("#submit_login").html("Enviar");
            $inputs2.prop("disabled", false);
          } else {
            ons.notification.toast({ message: "No hemos encontrado el usuario", timeout: 1e3 });
            $inputs2.prop("disabled", false);
            $("#submit_login").html(login_btn_text2);
          }
          break;
        case 2:
          if (response != "unsuccessful") {
            ons.notification.toast({ message: "Password cambiado correctamente.", timeout: 1e3 });
            $("#login_password_box").remove();
            $(".login_buttons").remove();
          } else {
            ons.notification.toast({ message: "El c\xF3digo de solicitud ya ha sido usado o ha caducado", timeout: 1e3 });
            $inputs2.prop("disabled", false);
            $("#submit_login").html(login_btn_text2);
          }
          break;
        default:
          if (response !== "unsuccessful") {
            var session_response = $.parseJSON(response);
            ons.notification.toast({ message: "Datos correctos", timeout: 1e3 });
            getLoginAcess(session_response);
          } else {
            modal2.hide();
            ons.notification.toast({ message: "Datos incorrectos", timeout: 1e3 });
            $inputs2.prop("disabled", false);
            $("#submit_login").html(login_btn_text2);
          }
          break;
      }
    });
    request.fail(function(jqXHR, textStatus, errorThrown) {
      console.error(
        "Han ocurrido los siguientes errores: " + textStatus,
        errorThrown
      );
    });
    request.always(function() {
    });
  } else {
    if (!lenUser) {
      $("#login_user").addClass("input_required");
    }
    if (!lenPass) {
      $("#login_password").addClass("input_required");
    }
    ons.notification.toast({ message: "Faltan datos para ingresar", timeout: 1e3 });
  }
  return false;
});
$(document).on("submit", "#register_form", function() {
  var lenUser = $("#login_register_user").val().length >= 4 ? 1 : 0;
  var lenPass = $("#login_register_password").val().length >= 4 ? 1 : 0;
  if ($("#login_register_password").val() == $("#login_register_password_confirm").val()) {
    if (lenUser + lenPass === 2) {
      var loginPath = phpValidate + "?method=register_user";
      var request;
      if (request) {
        request.abort();
      }
      var $form = $(this);
      var $inputs2 = $form.find("input, select, button, textarea, checkbox");
      var serializedData = $form.serialize();
      $inputs2.prop("disabled", true);
      var register_btn_text = $("#get_register").html();
      request = $.ajax({
        url: loginPath,
        type: "post",
        data: serializedData
      });
      request.done(function(response, textStatus, jqXHR) {
        if (response !== "unsuccessful") {
          ons.notification.toast({ message: "Registro exitoso", timeout: 2e3 });
          $("#push-return").trigger("click");
        } else {
          ons.notification.toast({ message: response, timeout: 2e3 });
          $inputs2.prop("disabled", false);
          $("#get_register").html(register_btn_text);
        }
      });
      request.fail(function(jqXHR, textStatus, errorThrown) {
        console.error(
          "Han ocurrido los siguientes errores: " + textStatus,
          errorThrown
        );
      });
      request.always(function() {
      });
    } else {
      ons.notification.toast({ message: "Password o usuario incompleto", timeout: 2e3 });
    }
  } else {
    ons.notification.toast({ message: "Las contrase\xF1as no coinciden", timeout: 2e3 });
  }
  return false;
});
$(document).on("submit", "#recover_form", function() {
  var lenPass = $("#login_recover_pass").val().length >= 4 ? 1 : 0;
  if ($("#login_register_password").val() === $("#login_register_password_confirm").val()) {
    if (lenPass === 1) {
      var loginPath = phpValidate + "?method=request_pass";
      var request;
      if (request) {
        request.abort();
      }
      var $form = $(this);
      var $inputs2 = $form.find("input, select, button, textarea, checkbox");
      var serializedData = $form.serialize();
      $inputs2.prop("disabled", true);
      $("#get_register").html();
      request = $.ajax({
        url: loginPath,
        type: "post",
        data: serializedData
      });
      request.done(function(response, textStatus, jqXHR) {
        if (response !== "unsuccessful") {
          ons.notification.toast({ message: "Revise su correo electr\xF3nico.", timeout: 2e3 });
          myNavigator.popPage();
        } else {
          ons.notification.toast({ message: "No se localiza el usuario", timeout: 2e3 });
          $inputs2.prop("disabled", false);
        }
      });
      request.fail(function(jqXHR, textStatus, errorThrown) {
        console.error(
          "Han ocurrido los siguientes errores: " + textStatus,
          errorThrown
        );
      });
      request.always(function() {
      });
    } else {
      ons.notification.toast({ message: "Faltan datos por ingresar", timeout: 2e3 });
    }
  } else {
    ons.notification.toast({ message: "Las contrase\xF1as no coiciden", timeout: 2e3 });
  }
  return false;
});
$(document).on(clickHandler, "#do_logout", function() {
  if (!touchmoved) {
    do_logout();
  }
  return false;
}).on("touchmove", function(e) {
  touchmoved = true;
}).on("touchstart", function() {
  touchmoved = false;
});
function do_logout() {
  var finalizeLogout = function() {
    if (typeof window.token_sent !== "undefined") {
      window.token_sent = 0;
    }
    localStorage.removeItem("id_pat");
    localStorage.removeItem("mail_pat");
    localStorage.removeItem("pass_pat");
    localStorage.removeItem("fcm_sync_required");
    localStorage.removeItem("fcm_last_synced_token");
    localStorage.removeItem("fcm_last_synced_bundle");
    clearSessionCookies();
    getLogOut();
  };
  var syncPromise = typeof unregisterFcmDevice === "function" ? unregisterFcmDevice() : $.Deferred().resolve().promise();
  var request = $.ajax({
    url: phpValidate,
    type: "post",
    data: { method: "do_logout" }
  });
  request.done(function(data, textStatus, jqXHR) {
    $.when(syncPromise).always(function() {
      finalizeLogout();
    });
  });
  request.fail(function(jqXHR, textStatus, errorThrown) {
    $.when(syncPromise).always(function() {
      finalizeLogout();
    });
  });
}
function showMsgError(target, message, color, timer) {
  target.html(message);
  target.css("color", color);
  target.addClass("show");
  clearTimeout(msgTimer);
  msgTimer = setTimeout(function() {
    target.removeClass("show");
  }, 3500);
  if (timer) {
    clearTimeout(msgTimer);
  }
}
