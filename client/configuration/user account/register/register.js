Session.setDefault('accountpopup',false);
Session.setDefault('showsignup',true);

Template.accountpopup.helpers({
  opacity: function () {
    if(Session.get('accountpopup')){ return 1; }
    else { return 0; }
  },
  pointerevents: function () {
    if(Session.get('accountpopup')){ return 'auto'; }
    else { return 'none'; }
  },
});

Template.accountpopup.events({
  'click #accountpopupbg': function(e) { 
    Session.set('accountpopup',false);
  },
});

Template.registration.helpers({
  showsignup: function () {
    if(Meteor.user()){ Session.set('accountpopup',false); }
    return Session.get('showsignup');
  },
});

Template.signup.events({
  'click #at-signIn': function(e) { 
    $(e.currentTarget).transition({animation  : 'jiggle',}); 
    Router.go('signin');
  },
});

Template.signin.events({
  'click #at-signUp': function(e) { 
    $(e.currentTarget).transition({animation  : 'jiggle',}); 
    Router.go('signup');
  },
});

AccountsTemplates.configure({
    // Behaviour
    confirmPassword: true,
    enablePasswordChange: true,
    forbidClientAccountCreation: false,
    overrideLoginErrors: true,
    sendVerificationEmail: false,

    // Appearance
    showAddRemoveServices: false,
    showForgotPasswordLink: false,
    showLabels: true,
    showPlaceholders: true,

    // Client-side Validation
    continuousValidation: false,
    negativeFeedback: false,
    negativeValidation: true,
    positiveValidation: true,
    positiveFeedback: true,
    showValidating: true,

    // Privacy Policy and Terms of Use
    privacyUrl: 'privacypolicy',
    termsUrl: 'termsofuse',

    // Redirects
    homeRoutePath: '/',
    redirectTimeout: 4000,

    // Texts
    texts: {
      button: {
          signUp: "Register Now!"
      },
      socialSignUp: "Register",
      socialIcons: {
          "meteor-developer": "fa fa-rocket"
      },
      title: {
          forgotPwd: "Recover Your Passwod"
      },
    },
});

AccountsTemplates.configure({
    texts: {
        navSignIn: "signIn",
        navSignOut: "signOut",
        optionalField: "optional",
        pwdLink_pre: "asdasd asdasda sd asd s ",
        pwdLink_link: "forgotPassword",
        pwdLink_suff: "",
        sep: "OR",
        signInLink_pre: "If you already have an account, please ",
        signInLink_link: "Sign In",
        signInLink_suff: "",
        signUpLink_pre: "Join the GMS today when you ",
        signUpLink_link: "Sign Up",
        signUpLink_suff: "",
        socialAdd: "add",
        socialConfigure: "configure",
        socialIcons: {
            "meteor-developer": "fa fa-rocket",
        },
        socialRemove: "remove",
        socialSignIn: "signIn",
        socialSignUp: "signUp",
        socialWith: "with",
        termsPreamble: "When you sign up, you are also agreeing to the GMS's ",
        termsPrivacy: "privacyPolicy",
        termsAnd: "and",
        termsTerms: "terms",
    }
});
                            
AccountsTemplates.configure({
    texts: {
      title: {
        changePwd: "Change Password",
        enrollAccount: "Enroll",
        forgotPwd: "Forgot Password",
        resetPwd: "Reset Password",
        signIn: "Welcome",
        signUp: "Registration",
      }
    }
});

AccountsTemplates.configure({
    texts: {
        button: {
          changePwd: "Password",
          enrollAccount: "Enroll",
          forgotPwd: "Forgot Pwd",
          resetPwd: "Reset Pwd",
          signIn: "Sign In",
          signUp: "Sign Up",
        }
    }
});

AccountsTemplates.addFields([
  { _id: 'password_again', type: 'password', required: false,
    displayName: "Verify", placeholder: 'Verify Password' },

  /*{ _id: 'username', type: 'text', required: true,
    displayName: "Username", placeholder: 'Caribbean' },*/

  { _id: 'firstname', type: 'text', required: true,
    displayName: "First Name", placeholder: 'Your' },
  { _id: 'lastname', type: 'text', required: true,
    displayName: "Last Name", placeholder: 'Name' },
]); 