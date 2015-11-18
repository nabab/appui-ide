<?php
/* @var $this \bbn\mvc */


$res = false;

if ( isset($this->data['dir'], $this->data['subdir'], $this->data['file']) &&
  ($ofile = \bbn\str\text::parse_path($this->data['file'])) &&
  ($cfg = $this->get_model('./directory', ['path' => $this->data['dir']]))
){
  $path = isset($cfg['files']['CTRL']) ? $cfg['files'][$this->data['subdir']]['fpath'] : $cfg['files'][key($cfg['files'])]['fpath'];

  $file = $path.$ofile;

  if ( !is_file($file) && isset($cfg['files']['CTRL']) ){
    $ofile = substr($ofile, 0, strrpos($ofile, '/'));
    $file = $path.$ofile;
  }

  $dir = dirname($ofile);
  $name = \bbn\str\text::file_ext($file, 1)[0];
  $ext = \bbn\str\text::file_ext($file);

  // Tab background and font colors
  $bcolor = isset($cfg['files']['CTRL']) && $this->data['subdir'] !== 'Controller' ? $cfg['files'][$this->data['subdir']]['bcolor'] : $cfg['bcolor'];
  $fcolor = isset($cfg['files']['CTRL']) && $this->data['subdir'] !== 'Controller' ? $cfg['files'][$this->data['subdir']]['fcolor'] : $cfg['fcolor'];

  if ( is_file($file) ){
    $def = '';
    if ( isset($cfg['files']['CTRL']) && $this->data['subdir'] === 'Controller' ) {
      $list = [];
      foreach ($cfg['files'] as $i => $f) {
        switch ($i) {
          case 'CTRL':
            $ctrl_file = dirname($file) . '/_ctrl.php';
            $content = is_file($ctrl_file) ? file_get_contents($ctrl_file) : $this->get_content('ide/defaults/default_ctrl.php');
            if ($id_option = $this->inc->options->get_id($this->data['dir'] . '/' . $ofile . '/_ctrl', BBN_ID_SCRIPT)) {
              $o = $this->inc->pref->get($id_option, $this->inc->user->get_id());
              if (md5($content) !== $o['code']) {
                $this->inc->pref->delete($id_option, $this->inc->user->get_id());
                $o = [];
              }
            }
            if (empty($o)) {
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
            if (!empty($f['default'])) {
              $def = $f['url'];
            }
            break;

          default:
            $value = '';
            $exts = explode(",", $f['ext']);
            foreach ($exts as $e) {
              $p = $f['fpath'] . str_replace('.' . $ext, '', $ofile) . '.' . trim($e);
              $value = is_file($p) ? $p : $value;
            }
            $content = is_file($value) && file_get_contents($value) !== '' ? file_get_contents($value) : $this->get_content('ide/defaults/default.' . $f['mode']);
            if ($id_option = $this->inc->options->get_id($this->data['dir'] . '/' . $ofile . '/' . $ext, BBN_ID_SCRIPT)) {
              $o = $this->inc->pref->get($id_option, $this->inc->user->get_id());
              if (md5($content) !== $o['code']) {
                $this->inc->pref->delete($id_option, $this->inc->user->get_id());
                $o = [];
              }
            }
            if (empty($o)) {
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
            if (!empty($f['default'])) {
              $def = $f['url'];
            }
            break;
        }
      }
      $res = [
        'title' => $dir !== '.' ? $dir . '/' . $name : $name,
        'url' => $this->data['dir'] . '/' . $ofile,
        'bcolor' => $bcolor,
        'fcolor' => $fcolor,
        'list' => $list,
        'def' => $def
      ];
    }
    else {
      $content = file_get_contents($path.$ofile);
      if ( $id_option = $this->inc->options->get_id($this->data['dir'].'/'.$ofile, BBN_ID_SCRIPT) ){
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
        'url' => $this->data['dir'].'/'.$ofile,
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
