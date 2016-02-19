<?php
/** @var $this \bbn\mvc\controller */

$model = $this->get_model();
$list = [];
$sess = [];
$current_dir = false;

// We define ide array in session
if ( !$this->inc->session->has('ide') ){
  $this->inc->session->set([
    'list' => $list
  ], 'ide');
}

if ( count($this->arguments) && isset($model['dirs'][$this->arguments[0]]) ){
  $current_dir = $this->arguments[0];
  if ( isset($model['dirs'][$this->arguments[0]]['tabs']) ){
    $found = false;
    $def = false;
    foreach ( $model['dirs'][$this->arguments[0]]['tabs'] as $t ){
      if ( !empty($t['default']) ){
        $def = $t;
      }
      if ( isset($this->arguments[1]) && ($t['url'] === $this->arguments[1]) ){
        $current_dir .= '/'.$t['url'];
        $found = 1;
        break;
      }
    }
    if ( !$found && $def ){
      $current_dir .= '/'.$def;
    }
  }
}

foreach ( $this->inc->session->get('ide', 'list') as $l ){
  $dirfile = explode('/', $l);
  if ( $tmp = $this->get_model('./load', [
    'dir' => array_shift($dirfile),
    'file' => implode('/', $dirfile)
  ]) ){
    if ( !isset($tmp['error']) ){
      array_push($list, $tmp);
      array_push($sess, $l);
    }
  }
}

$this->inc->session->set($sess, 'ide', 'list');

if ( !$current_dir && $this->inc->session->has('ide', 'dir') ){
  $current_dir = $this->inc->session->get('ide', 'dir');
}

$ide_cfg = $this->inc->user->get_cfg('ide');

echo $this
    ->set_title("IDE")
    ->add_js('./functions', [
      'dirs' => $model['dirs'],
      'root' => $this->say_dir().'/',
      'theme' => !empty($ide_cfg['theme']) ? $ide_cfg['theme'] : '',
      'font' => !empty($ide_cfg['font']) ? $ide_cfg['font'] : '',
      'font_size' => !empty($ide_cfg['font_size']) ? $ide_cfg['font_size'] : ''
    ])
    ->add_js([
      'menu' => $model['menu'],
      'config' => $list,
      'dirs' => $model['dirs'],
      'root' => $this->say_dir().'/',
      'url' => implode('/', $this->params),
      'current_dir' => $current_dir ? $current_dir : $model['default_dir']
    ])
    ->get_view().$this->get_less();
$this->obj->url = 'ide/editor';