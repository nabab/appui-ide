<?php
/* @var $this \bbn\mvc */

$d = new \bbn\ide\directories($this->db);

if ( empty($this->data) ){
  $r = $d->get();
}

else if ( (count($this->data) === 1) && !empty($this->data['id']) ){
  $r = $d->delete($this->data);
}

else if ( (count($this->data) > 1) && empty($this->data['id']) ){
  $r = $d->add($this->data);
}

else if ( (count($this->data) > 1) && !empty($this->data['id']) ){
  $r = $d->edit($this->data);
}

return ['ret' => $r];