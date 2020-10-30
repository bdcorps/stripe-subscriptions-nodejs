$(document).ready(function () {
  var publishableKey = "pk_test_51H8rImAkSQQctVkLFFZmJad2KISXWeDzpOeJ6ZnbsruFA9yRdzR1VeyjvkQnHn2j5RUoxdhQHeeWmucZrJ7MZLqR00AwkWR4SW";
  
  var stripe = Stripe(
    publishableKey  );
  var checkoutButton = $("#checkout-button");
  var portalButton = $("#portal-button");

  checkoutButton.click(function () {
    var product = $("input[name='product']:checked").val();

    fetch("/checkout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        product,
        customerID,
        email,
      }),
    })
      .then((result) => result.json())
      .then(({sessionId}) => stripe.redirectToCheckout({ sessionId }));
  });

  portalButton.click(function () {
    var requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        customer: customerID,
      }),
    };

    fetch("/portal", requestOptions)
      .then((response) => response.json())
      .then((result) => window.location.replace(result.url))
      .catch((error) => console.log("error", error));
  });
});
