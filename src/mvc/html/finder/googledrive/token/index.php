<div><?=_('This window will close automatically')?></div>
<script>
window.onload = () => {
  window.opener.postMessage({type: 'googledrivecode', code: '<?=$code?>'});
}
</script>