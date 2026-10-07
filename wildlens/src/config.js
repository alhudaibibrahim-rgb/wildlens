/* ------------------------------------------------------------------
   Rescue report delivery: NOT CONFIGURED YET.
   While provider is "none", the Send button saves the report on this
   device and shows the email that would be sent; nothing leaves the
   browser. See README §7 "Rescue reports" for how to switch it on.
------------------------------------------------------------------- */
const RESCUE_CONFIG = {
  provider: "none",          // "none" | "mailto" | "endpoint"
  to: [],                    // recipient addresses, e.g. ["wildlife@your-authority.gov"]
  endpoint: "",              // provider "endpoint": URL that accepts a multipart/form-data POST (e.g. a Formspree form or your own API)
  subjectPrefix: "[WildLens Rescue]",
  authorityName: "local wildlife authorities"
};
