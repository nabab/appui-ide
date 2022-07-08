<!-- HTML Document -->

<div class="bbn-padded bbn-lg">
  <p>
    This is a classic example of PHP view, which gets the data from the model as simple PHP variables.<br>
    Here the data is also sent to the javascript function, which can use it and interact with the element.
  </p>
  <div class="example5">
    <h2 class="example-receiver">&nbsp;</h2>
    <ul>
      <?php foreach ($countries as $country) { ?>
      <li><?= $country['country'] ?></li>
      <?php } ?>
    </ul>
  </div>
</div>

