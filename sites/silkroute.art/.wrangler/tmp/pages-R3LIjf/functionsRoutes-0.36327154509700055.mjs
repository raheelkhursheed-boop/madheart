import { onRequestGet as __admin_api_photos__id__js_onRequestGet } from "/home/user/madheart/sites/silkroute.art/functions/admin/api/photos/[id].js"
import { onRequestGet as __admin_api_works__id__js_onRequestGet } from "/home/user/madheart/sites/silkroute.art/functions/admin/api/works/[id].js"
import { onRequestPost as __admin_api_works__id__js_onRequestPost } from "/home/user/madheart/sites/silkroute.art/functions/admin/api/works/[id].js"
import { onRequestGet as __admin_api_works_js_onRequestGet } from "/home/user/madheart/sites/silkroute.art/functions/admin/api/works.js"
import { onRequestPost as __api_signup_js_onRequestPost } from "/home/user/madheart/sites/silkroute.art/functions/api/signup.js"
import { onRequestGet as __api_submission_js_onRequestGet } from "/home/user/madheart/sites/silkroute.art/functions/api/submission.js"
import { onRequestGet as __api_submission_photo_js_onRequestGet } from "/home/user/madheart/sites/silkroute.art/functions/api/submission-photo.js"
import { onRequestPost as __api_submit_js_onRequestPost } from "/home/user/madheart/sites/silkroute.art/functions/api/submit.js"
import { onRequest as __api_signup_js_onRequest } from "/home/user/madheart/sites/silkroute.art/functions/api/signup.js"
import { onRequest as __api_submit_js_onRequest } from "/home/user/madheart/sites/silkroute.art/functions/api/submit.js"
import { onRequestGet as __media__id__js_onRequestGet } from "/home/user/madheart/sites/silkroute.art/functions/media/[id].js"
import { onRequest as __admin__middleware_js_onRequest } from "/home/user/madheart/sites/silkroute.art/functions/admin/_middleware.js"
import { onRequest as ___middleware_js_onRequest } from "/home/user/madheart/sites/silkroute.art/functions/_middleware.js"

export const routes = [
    {
      routePath: "/admin/api/photos/:id",
      mountPath: "/admin/api/photos",
      method: "GET",
      middlewares: [],
      modules: [__admin_api_photos__id__js_onRequestGet],
    },
  {
      routePath: "/admin/api/works/:id",
      mountPath: "/admin/api/works",
      method: "GET",
      middlewares: [],
      modules: [__admin_api_works__id__js_onRequestGet],
    },
  {
      routePath: "/admin/api/works/:id",
      mountPath: "/admin/api/works",
      method: "POST",
      middlewares: [],
      modules: [__admin_api_works__id__js_onRequestPost],
    },
  {
      routePath: "/admin/api/works",
      mountPath: "/admin/api",
      method: "GET",
      middlewares: [],
      modules: [__admin_api_works_js_onRequestGet],
    },
  {
      routePath: "/api/signup",
      mountPath: "/api",
      method: "POST",
      middlewares: [],
      modules: [__api_signup_js_onRequestPost],
    },
  {
      routePath: "/api/submission",
      mountPath: "/api",
      method: "GET",
      middlewares: [],
      modules: [__api_submission_js_onRequestGet],
    },
  {
      routePath: "/api/submission-photo",
      mountPath: "/api",
      method: "GET",
      middlewares: [],
      modules: [__api_submission_photo_js_onRequestGet],
    },
  {
      routePath: "/api/submit",
      mountPath: "/api",
      method: "POST",
      middlewares: [],
      modules: [__api_submit_js_onRequestPost],
    },
  {
      routePath: "/api/signup",
      mountPath: "/api",
      method: "",
      middlewares: [],
      modules: [__api_signup_js_onRequest],
    },
  {
      routePath: "/api/submit",
      mountPath: "/api",
      method: "",
      middlewares: [],
      modules: [__api_submit_js_onRequest],
    },
  {
      routePath: "/media/:id",
      mountPath: "/media",
      method: "GET",
      middlewares: [],
      modules: [__media__id__js_onRequestGet],
    },
  {
      routePath: "/admin",
      mountPath: "/admin",
      method: "",
      middlewares: [__admin__middleware_js_onRequest],
      modules: [],
    },
  {
      routePath: "/",
      mountPath: "/",
      method: "",
      middlewares: [___middleware_js_onRequest],
      modules: [],
    },
  ]