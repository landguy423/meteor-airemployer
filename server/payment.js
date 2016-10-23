Meteor.methods({

  'chargecardforinvoice': function(stripeToken,invoiceid,emailaddress,price,currency) {
    var Stripe = StripeAPI('sk_live_8GHygdD9PAOvQQ1spagUSHKS');

    console.log(invoiceid);
    console.log(emailaddress);
    console.log(price);

    var realcurrency = null;

    if(currency === 'jm'){ realcurrency = 'JMD'; }
    else if(currency === 'tt'){ realcurrency = 'TTD'; }
    else if(currency === 'us'){ realcurrency = 'USD'; }
    else if(currency === 'ca'){ realcurrency = 'CAD'; }
    else if(currency === 'eu'){ realcurrency = 'EUR'; }
    else if(currency === 'gb'){ realcurrency = 'GBP'; }

    if(!realcurrency){ return null; }

    Stripe.charges.create(

      { 
        amount: price*100,
        currency: realcurrency, 

        source: stripeToken.id, 
        description: 'Digital Design and Development Services', 
        receipt_email: emailaddress  
      }, 

      Meteor.bindEnvironment(function(error, charge) {
        if(charge){    
          console.log('Successful Charge: ' + emailaddress + ' - ' + invoiceid + ' - $' + price);
          Meteor.call('newpayment',invoiceid,price,emailaddress,currency);
        } else {
          console.log('Failed Charge: ' + emailaddress + ' - ' + invoiceid + ' - $' + price);
          console.log(error);
        }
      })

    );
  },

});