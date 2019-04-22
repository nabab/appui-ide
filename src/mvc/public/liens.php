<?php
if ( count($ctrl->arguments) ){
  $ctrl->combo("Liste des ", ['type' => $ctrl->arguments[0]]);
}
