<?php

/** @var $ctrl \bbn\Mvc\Controller */

// The combo function returns the combination of the model and the HTML view
// plus the javascript and CSS of the same path if they exist

// The first argument will be the title of the tab
// Adding true as second argument will pass the data from the model to the javascript
$ctrl->combo("Example 3", true);
