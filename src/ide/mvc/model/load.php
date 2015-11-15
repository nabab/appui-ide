<?php
/* @var $this \bbn\mvc */

$cfg = $this->get_model('ide/editor');
$res = false;

if ( isset($this->data['dir'], $this->data['file']) &&
        isset($cfg['dirs'][$this->data['dir']]) &&
        (strpos($this->data['file'], '../') === false) ){
  $path = $this->data['dir'] === 'MVC' ? $cfg['dirs'][$this->data['dir']]['files']['Controller']['fpath'] : $cfg['dirs'][$this->data['dir']]['files'][key($cfg['dirs'][$this->data['dir']]['files'])]['fpath'];
  $file = $path.$this->data['file'];

  if ( !is_file($file) && $this->data['dir'] === 'MVC' ){
    $this->data['file'] = substr($this->data['file'], 0, strrpos($this->data['file'], '/'));
    $file = $path.$this->data['file'];
  }

  $dir = dirname($this->data['file']);
  $name = \bbn\str\text::file_ext($file, 1)[0];
  $ext = \bbn\str\text::file_ext($file);
  $bcolor = $cfg['dirs'][$this->data['dir']]['bcolor'];
  $fcolor = $cfg['dirs'][$this->data['dir']]['fcolor'];
  if ( is_file($file) ){
    $def = '';
    switch ( $this->data['dir'] ){
      case 'MVC':
        $list = [];
        foreach ( $cfg['dirs']['MVC']['files'] as $i => $f ){
          switch ( $i ){
            case 'CTRL':
              $ctrl_file = dirname($file).'/_ctrl.php';
              $content = is_file($ctrl_file) ? file_get_contents($ctrl_file) : $this->get_content('ide/defaults/default_ctrl.php');
              if ( $id_option = $this->inc->options->get_id($this->data['dir'].'/'.$this->data['file'].'/_ctrl', BBN_ID_SCRIPT) ){
                $o = $this->inc->pref->get($id_option, $this->inc->user->get_id());
                if ( md5($content) !== $o['code'] ){
                  $this->inc->pref->delete($id_option, $this->inc->user->get_id());
                  $o = [];
                }
              }
              if ( empty($o) ){
                $o = [];
              }
              array_push($list, [
                'title' => $f['title'],
                'url' => $f['url'],
                'bcolor' => $f['bcolor'],
                'fcolor' => $f['fcolor'],
                'cfg' => [
                  'mode' => $f['mode'],
                  'value' => $content,
                  'selections' => !empty($o['selections']) ? $o['selections'] : [],
                  'marks' => !empty($o['marks']) ? $o['marks'] : []
                ],
                'static' => 1
              ]);
              if ( !empty($f['default']) ){
                $def = $f['url'];
              }
              break;

            default:
              $value = '';
              $exts = explode(",", $f['ext']);
              foreach ( $exts as $e ){
                $p = $f['fpath'].str_replace('.'.$ext, '', $this->data['file']).'.'.trim($e);
                $value = is_file($p) ? $p : $value;
              }
              $content = is_file($value) && file_get_contents($value) !== '' ? file_get_contents($value) : $this->get_content('ide/defaults/default.'.$f['mode']);
              if ( $id_option = $this->inc->options->get_id($this->data['dir'].'/'.$this->data['file'].'/'.$ext, BBN_ID_SCRIPT) ){
                $o = $this->inc->pref->get($id_option, $this->inc->user->get_id());
                if ( md5($content) !== $o['code'] ){
                  $this->inc->pref->delete($id_option, $this->inc->user->get_id());
                  $o = [];
                }
              }
              if ( empty($o) ){
                $o = [];
              }
              array_push($list, [
                'title' => $f['title'],
                'url' => $f['url'],
                'bcolor' => $f['bcolor'],
                'fcolor' => $f['fcolor'],
                'cfg' => [
                  'mode' => $f['mode'],
                  'value' => $content,
                  'selections' => !empty($o['selections']) ? $o['selections'] : [],
                  'marks' => !empty($o['marks']) ? $o['marks'] : []
                ],
                'static' => 1
              ]);
              if ( !empty($f['default']) ){
                $def = $f['url'];
              }
              break;
          }
        }
        $res = [
          'title' => $dir !== '.' ? $dir.'/'.$name : $name,
          'url' => $this->data['dir'].'/'.$this->data['file'],
          'bcolor' => $bcolor,
          'fcolor' => $fcolor,
          'list' => $list,
          'def' => $def
        ];
        break;

      default:
        $content = file_get_contents($path.$this->data['file']);
        if ( $id_option = $this->inc->options->get_id($this->data['dir'].'/'.$this->data['file'], BBN_ID_SCRIPT) ){
          $o = $this->inc->pref->get($id_option, $this->inc->user->get_id());
          if ( md5($content) !== $o['code'] ){
            $this->inc->pref->delete($id_option, $this->inc->user->get_id());
            $o = [];
          }
        }
        if ( empty($o) ){
          $o = [];
        }
        $res = [
          'title' => $name,
          'url' => $this->data['dir'].'/'.$this->data['file'],
          'bcolor' => $bcolor,
          'fcolor' => $fcolor,
          'cfg' => [
            'mode' => $ext,
            'value' => $content,
            'selections' => !empty($o['selections']) ? $o['selections'] : [],
            'marks' => !empty($o['marks']) ? $o['marks'] : []
          ]
        ];
    }
  }
}
return $res;