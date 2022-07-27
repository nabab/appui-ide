<?php

if ( isset($model->inc->ide)  ){
  return[
    'success' =>  $model->inc->ide->setTheme($model->data['theme'])
  ];
}

return [
  'success' => false
];