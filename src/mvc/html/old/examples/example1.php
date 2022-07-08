<!-- HTML Document -->

<div class="bbn-padded bbn-lg">
  <p>
    This is a classic example of PHP view, which gets the data from the model as simple PHP variables.<br>
    PHP is included as the simple templating language it is.
  </p>
  <div class="example1">
    <h2>
      <?= $myTitle ?>
    </h2>
    <ul>
      <?php foreach ($countries as $country) { ?>
      <li><?= $country['country'] ?></li>
      <?php } ?>
    </ul>
    <p class="example_receiver"></p>
  </div>
</div>

