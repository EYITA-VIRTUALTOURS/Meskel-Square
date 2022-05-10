(function(){
    var script = {
 "mouseWheelEnabled": true,
 "layout": "absolute",
 "start": "this.init(); this.visibleComponentsIfPlayerFlagEnabled([this.IconButton_8890AD7C_AF3A_A716_41D7_D5ACF7CBB89B], 'gyroscopeAvailable')",
 "scrollBarWidth": 10,
 "id": "rootPlayer",
 "vrPolyfillScale": 0.5,
 "propagateClick": false,
 "desktopMipmappingEnabled": false,
 "mobileMipmappingEnabled": false,
 "paddingLeft": 0,
 "backgroundPreloadEnabled": true,
 "scrollBarColor": "#000000",
 "borderSize": 0,
 "scrollBarVisible": "rollOver",
 "minWidth": 20,
 "children": [
  "this.MainViewer",
  "this.IconButton_8890AD7C_AF3A_A716_41D7_D5ACF7CBB89B"
 ],
 "class": "Player",
 "scripts": {
  "pauseGlobalAudiosWhilePlayItem": function(playList, index, exclude){  var self = this; var item = playList.get('items')[index]; var media = item.get('media'); var player = item.get('player'); var caller = media.get('id'); var endFunc = function(){ if(playList.get('selectedIndex') != index) { if(hasState){ player.unbind('stateChange', stateChangeFunc, self); } self.resumeGlobalAudios(caller); } }; var stateChangeFunc = function(event){ var state = event.data.state; if(state == 'stopped'){ this.resumeGlobalAudios(caller); } else if(state == 'playing'){ this.pauseGlobalAudios(caller, exclude); } }; var mediaClass = media.get('class'); var hasState = mediaClass == 'Video360' || mediaClass == 'Video'; if(hasState){ player.bind('stateChange', stateChangeFunc, this); } this.pauseGlobalAudios(caller, exclude); this.executeFunctionWhenChange(playList, index, endFunc, endFunc); },
  "autotriggerAtStart": function(playList, callback, once){  var onChange = function(event){ callback(); if(once == true) playList.unbind('change', onChange, this); }; playList.bind('change', onChange, this); },
  "loadFromCurrentMediaPlayList": function(playList, delta){  var currentIndex = playList.get('selectedIndex'); var totalItems = playList.get('items').length; var newIndex = (currentIndex + delta) % totalItems; while(newIndex < 0){ newIndex = totalItems + newIndex; }; if(currentIndex != newIndex){ playList.set('selectedIndex', newIndex); } },
  "setStartTimeVideo": function(video, time){  var items = this.getPlayListItems(video); var startTimeBackup = []; var restoreStartTimeFunc = function() { for(var i = 0; i<items.length; ++i){ var item = items[i]; item.set('startTime', startTimeBackup[i]); item.unbind('stop', restoreStartTimeFunc, this); } }; for(var i = 0; i<items.length; ++i) { var item = items[i]; var player = item.get('player'); if(player.get('video') == video && player.get('state') == 'playing') { player.seek(time); } else { startTimeBackup.push(item.get('startTime')); item.set('startTime', time); item.bind('stop', restoreStartTimeFunc, this); } } },
  "historyGoBack": function(playList){  var history = this.get('data')['history'][playList.get('id')]; if(history != undefined) { history.back(); } },
  "loopAlbum": function(playList, index){  var playListItem = playList.get('items')[index]; var player = playListItem.get('player'); var loopFunction = function(){ player.play(); }; this.executeFunctionWhenChange(playList, index, loopFunction); },
  "initGA": function(){  var sendFunc = function(category, event, label) { ga('send', 'event', category, event, label); }; var media = this.getByClassName('Panorama'); media = media.concat(this.getByClassName('Video360')); media = media.concat(this.getByClassName('Map')); for(var i = 0, countI = media.length; i<countI; ++i){ var m = media[i]; var mediaLabel = m.get('label'); var overlays = this.getOverlays(m); for(var j = 0, countJ = overlays.length; j<countJ; ++j){ var overlay = overlays[j]; var overlayLabel = overlay.get('data') != undefined ? mediaLabel + ' - ' + overlay.get('data')['label'] : mediaLabel; switch(overlay.get('class')) { case 'HotspotPanoramaOverlay': case 'HotspotMapOverlay': var areas = overlay.get('areas'); for (var z = 0; z<areas.length; ++z) { areas[z].bind('click', sendFunc.bind(this, 'Hotspot', 'click', overlayLabel), this); } break; case 'CeilingCapPanoramaOverlay': case 'TripodCapPanoramaOverlay': overlay.bind('click', sendFunc.bind(this, 'Cap', 'click', overlayLabel), this); break; } } } var components = this.getByClassName('Button'); components = components.concat(this.getByClassName('IconButton')); for(var i = 0, countI = components.length; i<countI; ++i){ var c = components[i]; var componentLabel = c.get('data')['name']; c.bind('click', sendFunc.bind(this, 'Skin', 'click', componentLabel), this); } var items = this.getByClassName('PlayListItem'); var media2Item = {}; for(var i = 0, countI = items.length; i<countI; ++i) { var item = items[i]; var media = item.get('media'); if(!(media.get('id') in media2Item)) { item.bind('begin', sendFunc.bind(this, 'Media', 'play', media.get('label')), this); media2Item[media.get('id')] = item; } } },
  "getGlobalAudio": function(audio){  var audios = window.currentGlobalAudios; if(audios != undefined && audio.get('id') in audios){ audio = audios[audio.get('id')]; } return audio; },
  "registerKey": function(key, value){  window[key] = value; },
  "getPlayListItemByMedia": function(playList, media){  var items = playList.get('items'); for(var j = 0, countJ = items.length; j<countJ; ++j){ var item = items[j]; if(item.get('media') == media) return item; } return undefined; },
  "getMediaWidth": function(media){  switch(media.get('class')){ case 'Video360': var res = media.get('video'); if(res instanceof Array){ var maxW=0; for(var i=0; i<res.length; i++){ var r = res[i]; if(r.get('width') > maxW) maxW = r.get('width'); } return maxW; }else{ return r.get('width') } default: return media.get('width'); } },
  "updateMediaLabelFromPlayList": function(playList, htmlText, playListItemStopToDispose){  var changeFunction = function(){ var index = playList.get('selectedIndex'); if(index >= 0){ var beginFunction = function(){ playListItem.unbind('begin', beginFunction); setMediaLabel(index); }; var setMediaLabel = function(index){ var media = playListItem.get('media'); var text = media.get('data'); if(!text) text = media.get('label'); setHtml(text); }; var setHtml = function(text){ if(text !== undefined) { htmlText.set('html', '<div style=\"text-align:left\"><SPAN STYLE=\"color:#FFFFFF;font-size:12px;font-family:Verdana\"><span color=\"white\" font-family=\"Verdana\" font-size=\"12px\">' + text + '</SPAN></div>'); } else { htmlText.set('html', ''); } }; var playListItem = playList.get('items')[index]; if(htmlText.get('html')){ setHtml('Loading...'); playListItem.bind('begin', beginFunction); } else{ setMediaLabel(index); } } }; var disposeFunction = function(){ htmlText.set('html', undefined); playList.unbind('change', changeFunction, this); playListItemStopToDispose.unbind('stop', disposeFunction, this); }; if(playListItemStopToDispose){ playListItemStopToDispose.bind('stop', disposeFunction, this); } playList.bind('change', changeFunction, this); changeFunction(); },
  "setMainMediaByIndex": function(index){  var item = undefined; if(index >= 0 && index < this.mainPlayList.get('items').length){ this.mainPlayList.set('selectedIndex', index); item = this.mainPlayList.get('items')[index]; } return item; },
  "shareWhatsapp": function(url){  window.open('https://api.whatsapp.com/send/?text=' + encodeURIComponent(url), '_blank'); },
  "getCurrentPlayerWithMedia": function(media){  var playerClass = undefined; var mediaPropertyName = undefined; switch(media.get('class')) { case 'Panorama': case 'LivePanorama': case 'HDRPanorama': playerClass = 'PanoramaPlayer'; mediaPropertyName = 'panorama'; break; case 'Video360': playerClass = 'PanoramaPlayer'; mediaPropertyName = 'video'; break; case 'PhotoAlbum': playerClass = 'PhotoAlbumPlayer'; mediaPropertyName = 'photoAlbum'; break; case 'Map': playerClass = 'MapPlayer'; mediaPropertyName = 'map'; break; case 'Video': playerClass = 'VideoPlayer'; mediaPropertyName = 'video'; break; }; if(playerClass != undefined) { var players = this.getByClassName(playerClass); for(var i = 0; i<players.length; ++i){ var player = players[i]; if(player.get(mediaPropertyName) == media) { return player; } } } else { return undefined; } },
  "stopGlobalAudio": function(audio){  var audios = window.currentGlobalAudios; if(audios){ audio = audios[audio.get('id')]; if(audio){ delete audios[audio.get('id')]; if(Object.keys(audios).length == 0){ window.currentGlobalAudios = undefined; } } } if(audio) audio.stop(); },
  "unregisterKey": function(key){  delete window[key]; },
  "getCurrentPlayers": function(){  var players = this.getByClassName('PanoramaPlayer'); players = players.concat(this.getByClassName('VideoPlayer')); players = players.concat(this.getByClassName('Video360Player')); players = players.concat(this.getByClassName('PhotoAlbumPlayer')); return players; },
  "showPopupPanoramaVideoOverlay": function(popupPanoramaOverlay, closeButtonProperties, stopAudios){  var self = this; var showEndFunction = function() { popupPanoramaOverlay.unbind('showEnd', showEndFunction); closeButton.bind('click', hideFunction, this); setCloseButtonPosition(); closeButton.set('visible', true); }; var endFunction = function() { if(!popupPanoramaOverlay.get('loop')) hideFunction(); }; var hideFunction = function() { self.MainViewer.set('toolTipEnabled', true); popupPanoramaOverlay.set('visible', false); closeButton.set('visible', false); closeButton.unbind('click', hideFunction, self); popupPanoramaOverlay.unbind('end', endFunction, self); popupPanoramaOverlay.unbind('hideEnd', hideFunction, self, true); self.resumePlayers(playersPaused, true); if(stopAudios) { self.resumeGlobalAudios(); } }; var setCloseButtonPosition = function() { var right = 10; var top = 10; closeButton.set('right', right); closeButton.set('top', top); }; this.MainViewer.set('toolTipEnabled', false); var closeButton = this.closeButtonPopupPanorama; if(closeButtonProperties){ for(var key in closeButtonProperties){ closeButton.set(key, closeButtonProperties[key]); } } var playersPaused = this.pauseCurrentPlayers(true); if(stopAudios) { this.pauseGlobalAudios(); } popupPanoramaOverlay.bind('end', endFunction, this, true); popupPanoramaOverlay.bind('showEnd', showEndFunction, this, true); popupPanoramaOverlay.bind('hideEnd', hideFunction, this, true); popupPanoramaOverlay.set('visible', true); },
  "pauseCurrentPlayers": function(onlyPauseCameraIfPanorama){  var players = this.getCurrentPlayers(); var i = players.length; while(i-- > 0){ var player = players[i]; if(player.get('state') == 'playing') { if(onlyPauseCameraIfPanorama && player.get('class') == 'PanoramaPlayer' && typeof player.get('video') === 'undefined'){ player.pauseCamera(); } else { player.pause(); } } else { players.splice(i, 1); } } return players; },
  "keepComponentVisibility": function(component, keep){  var key = 'keepVisibility_' + component.get('id'); var value = this.getKey(key); if(value == undefined && keep) { this.registerKey(key, keep); } else if(value != undefined && !keep) { this.unregisterKey(key); } },
  "playAudioList": function(audios){  if(audios.length == 0) return; var currentAudioCount = -1; var currentAudio; var playGlobalAudioFunction = this.playGlobalAudio; var playNext = function(){ if(++currentAudioCount >= audios.length) currentAudioCount = 0; currentAudio = audios[currentAudioCount]; playGlobalAudioFunction(currentAudio, playNext); }; playNext(); },
  "getPlayListItems": function(media, player){  var itemClass = (function() { switch(media.get('class')) { case 'Panorama': case 'LivePanorama': case 'HDRPanorama': return 'PanoramaPlayListItem'; case 'Video360': return 'Video360PlayListItem'; case 'PhotoAlbum': return 'PhotoAlbumPlayListItem'; case 'Map': return 'MapPlayListItem'; case 'Video': return 'VideoPlayListItem'; } })(); if (itemClass != undefined) { var items = this.getByClassName(itemClass); for (var i = items.length-1; i>=0; --i) { var item = items[i]; if(item.get('media') != media || (player != undefined && item.get('player') != player)) { items.splice(i, 1); } } return items; } else { return []; } },
  "cloneCamera": function(camera){  var newCamera = this.rootPlayer.createInstance(camera.get('class')); newCamera.set('id', camera.get('id') + '_copy'); newCamera.set('idleSequence', camera.get('initialSequence')); return newCamera; },
  "isCardboardViewMode": function(){  var players = this.getByClassName('PanoramaPlayer'); return players.length > 0 && players[0].get('viewMode') == 'cardboard'; },
  "getComponentByName": function(name){  var list = this.getByClassName('UIComponent'); for(var i = 0, count = list.length; i<count; ++i){ var component = list[i]; var data = component.get('data'); if(data != undefined && data.name == name){ return component; } } return undefined; },
  "setPanoramaCameraWithSpot": function(playListItem, yaw, pitch){  var panorama = playListItem.get('media'); var newCamera = this.cloneCamera(playListItem.get('camera')); var initialPosition = newCamera.get('initialPosition'); initialPosition.set('yaw', yaw); initialPosition.set('pitch', pitch); this.startPanoramaWithCamera(panorama, newCamera); },
  "executeFunctionWhenChange": function(playList, index, endFunction, changeFunction){  var endObject = undefined; var changePlayListFunction = function(event){ if(event.data.previousSelectedIndex == index){ if(changeFunction) changeFunction.call(this); if(endFunction && endObject) endObject.unbind('end', endFunction, this); playList.unbind('change', changePlayListFunction, this); } }; if(endFunction){ var playListItem = playList.get('items')[index]; if(playListItem.get('class') == 'PanoramaPlayListItem'){ var camera = playListItem.get('camera'); if(camera != undefined) endObject = camera.get('initialSequence'); if(endObject == undefined) endObject = camera.get('idleSequence'); } else{ endObject = playListItem.get('media'); } if(endObject){ endObject.bind('end', endFunction, this); } } playList.bind('change', changePlayListFunction, this); },
  "visibleComponentsIfPlayerFlagEnabled": function(components, playerFlag){  var enabled = this.get(playerFlag); for(var i in components){ components[i].set('visible', enabled); } },
  "setComponentVisibility": function(component, visible, applyAt, effect, propertyEffect, ignoreClearTimeout){  var keepVisibility = this.getKey('keepVisibility_' + component.get('id')); if(keepVisibility) return; this.unregisterKey('visibility_'+component.get('id')); var changeVisibility = function(){ if(effect && propertyEffect){ component.set(propertyEffect, effect); } component.set('visible', visible); if(component.get('class') == 'ViewerArea'){ try{ if(visible) component.restart(); else if(component.get('playbackState') == 'playing') component.pause(); } catch(e){}; } }; var effectTimeoutName = 'effectTimeout_'+component.get('id'); if(!ignoreClearTimeout && window.hasOwnProperty(effectTimeoutName)){ var effectTimeout = window[effectTimeoutName]; if(effectTimeout instanceof Array){ for(var i=0; i<effectTimeout.length; i++){ clearTimeout(effectTimeout[i]) } }else{ clearTimeout(effectTimeout); } delete window[effectTimeoutName]; } else if(visible == component.get('visible') && !ignoreClearTimeout) return; if(applyAt && applyAt > 0){ var effectTimeout = setTimeout(function(){ if(window[effectTimeoutName] instanceof Array) { var arrayTimeoutVal = window[effectTimeoutName]; var index = arrayTimeoutVal.indexOf(effectTimeout); arrayTimeoutVal.splice(index, 1); if(arrayTimeoutVal.length == 0){ delete window[effectTimeoutName]; } }else{ delete window[effectTimeoutName]; } changeVisibility(); }, applyAt); if(window.hasOwnProperty(effectTimeoutName)){ window[effectTimeoutName] = [window[effectTimeoutName], effectTimeout]; }else{ window[effectTimeoutName] = effectTimeout; } } else{ changeVisibility(); } },
  "resumePlayers": function(players, onlyResumeCameraIfPanorama){  for(var i = 0; i<players.length; ++i){ var player = players[i]; if(onlyResumeCameraIfPanorama && player.get('class') == 'PanoramaPlayer' && typeof player.get('video') === 'undefined'){ player.resumeCamera(); } else{ player.play(); } } },
  "historyGoForward": function(playList){  var history = this.get('data')['history'][playList.get('id')]; if(history != undefined) { history.forward(); } },
  "setMainMediaByName": function(name){  var items = this.mainPlayList.get('items'); for(var i = 0; i<items.length; ++i){ var item = items[i]; if(item.get('media').get('label') == name) { this.mainPlayList.set('selectedIndex', i); return item; } } },
  "showWindow": function(w, autoCloseMilliSeconds, containsAudio){  if(w.get('visible') == true){ return; } var closeFunction = function(){ clearAutoClose(); this.resumePlayers(playersPaused, !containsAudio); w.unbind('close', closeFunction, this); }; var clearAutoClose = function(){ w.unbind('click', clearAutoClose, this); if(timeoutID != undefined){ clearTimeout(timeoutID); } }; var timeoutID = undefined; if(autoCloseMilliSeconds){ var autoCloseFunction = function(){ w.hide(); }; w.bind('click', clearAutoClose, this); timeoutID = setTimeout(autoCloseFunction, autoCloseMilliSeconds); } var playersPaused = this.pauseCurrentPlayers(!containsAudio); w.bind('close', closeFunction, this); w.show(this, true); },
  "resumeGlobalAudios": function(caller){  if (window.pauseGlobalAudiosState == undefined || !(caller in window.pauseGlobalAudiosState)) return; var audiosPaused = window.pauseGlobalAudiosState[caller]; delete window.pauseGlobalAudiosState[caller]; var values = Object.values(window.pauseGlobalAudiosState); for (var i = 0, count = values.length; i<count; ++i) { var objAudios = values[i]; for (var j = audiosPaused.length-1; j>=0; --j) { var a = audiosPaused[j]; if(objAudios.indexOf(a) != -1) audiosPaused.splice(j, 1); } } for (var i = 0, count = audiosPaused.length; i<count; ++i) { var a = audiosPaused[i]; if (a.get('state') == 'paused') a.play(); } },
  "getPixels": function(value){  var result = new RegExp('((\\+|\\-)?\\d+(\\.\\d*)?)(px|vw|vh|vmin|vmax)?', 'i').exec(value); if (result == undefined) { return 0; } var num = parseFloat(result[1]); var unit = result[4]; var vw = this.rootPlayer.get('actualWidth') / 100; var vh = this.rootPlayer.get('actualHeight') / 100; switch(unit) { case 'vw': return num * vw; case 'vh': return num * vh; case 'vmin': return num * Math.min(vw, vh); case 'vmax': return num * Math.max(vw, vh); default: return num; } },
  "getMediaByName": function(name){  var list = this.getByClassName('Media'); for(var i = 0, count = list.length; i<count; ++i){ var media = list[i]; if((media.get('class') == 'Audio' && media.get('data').label == name) || media.get('label') == name){ return media; } } return undefined; },
  "getOverlays": function(media){  switch(media.get('class')){ case 'Panorama': var overlays = media.get('overlays').concat() || []; var frames = media.get('frames'); for(var j = 0; j<frames.length; ++j){ overlays = overlays.concat(frames[j].get('overlays') || []); } return overlays; case 'Video360': case 'Map': return media.get('overlays') || []; default: return []; } },
  "changeBackgroundWhilePlay": function(playList, index, color){  var stopFunction = function(event){ playListItem.unbind('stop', stopFunction, this); if((color == viewerArea.get('backgroundColor')) && (colorRatios == viewerArea.get('backgroundColorRatios'))){ viewerArea.set('backgroundColor', backgroundColorBackup); viewerArea.set('backgroundColorRatios', backgroundColorRatiosBackup); } }; var playListItem = playList.get('items')[index]; var player = playListItem.get('player'); var viewerArea = player.get('viewerArea'); var backgroundColorBackup = viewerArea.get('backgroundColor'); var backgroundColorRatiosBackup = viewerArea.get('backgroundColorRatios'); var colorRatios = [0]; if((color != backgroundColorBackup) || (colorRatios != backgroundColorRatiosBackup)){ viewerArea.set('backgroundColor', color); viewerArea.set('backgroundColorRatios', colorRatios); playListItem.bind('stop', stopFunction, this); } },
  "init": function(){  if(!Object.hasOwnProperty('values')) { Object.values = function(o){ return Object.keys(o).map(function(e) { return o[e]; }); }; } var history = this.get('data')['history']; var playListChangeFunc = function(e){ var playList = e.source; var index = playList.get('selectedIndex'); if(index < 0) return; var id = playList.get('id'); if(!history.hasOwnProperty(id)) history[id] = new HistoryData(playList); history[id].add(index); }; var playLists = this.getByClassName('PlayList'); for(var i = 0, count = playLists.length; i<count; ++i) { var playList = playLists[i]; playList.bind('change', playListChangeFunc, this); } },
  "changePlayListWithSameSpot": function(playList, newIndex){  var currentIndex = playList.get('selectedIndex'); if (currentIndex >= 0 && newIndex >= 0 && currentIndex != newIndex) { var currentItem = playList.get('items')[currentIndex]; var newItem = playList.get('items')[newIndex]; var currentPlayer = currentItem.get('player'); var newPlayer = newItem.get('player'); if ((currentPlayer.get('class') == 'PanoramaPlayer' || currentPlayer.get('class') == 'Video360Player') && (newPlayer.get('class') == 'PanoramaPlayer' || newPlayer.get('class') == 'Video360Player')) { var newCamera = this.cloneCamera(newItem.get('camera')); this.setCameraSameSpotAsMedia(newCamera, currentItem.get('media')); this.startPanoramaWithCamera(newItem.get('media'), newCamera); } } },
  "getMediaHeight": function(media){  switch(media.get('class')){ case 'Video360': var res = media.get('video'); if(res instanceof Array){ var maxH=0; for(var i=0; i<res.length; i++){ var r = res[i]; if(r.get('height') > maxH) maxH = r.get('height'); } return maxH; }else{ return r.get('height') } default: return media.get('height'); } },
  "playGlobalAudioWhilePlay": function(playList, index, audio, endCallback){  var changeFunction = function(event){ if(event.data.previousSelectedIndex == index){ this.stopGlobalAudio(audio); if(isPanorama) { var media = playListItem.get('media'); var audios = media.get('audios'); audios.splice(audios.indexOf(audio), 1); media.set('audios', audios); } playList.unbind('change', changeFunction, this); if(endCallback) endCallback(); } }; var audios = window.currentGlobalAudios; if(audios && audio.get('id') in audios){ audio = audios[audio.get('id')]; if(audio.get('state') != 'playing'){ audio.play(); } return audio; } playList.bind('change', changeFunction, this); var playListItem = playList.get('items')[index]; var isPanorama = playListItem.get('class') == 'PanoramaPlayListItem'; if(isPanorama) { var media = playListItem.get('media'); var audios = (media.get('audios') || []).slice(); if(audio.get('class') == 'MediaAudio') { var panoramaAudio = this.rootPlayer.createInstance('PanoramaAudio'); panoramaAudio.set('autoplay', false); panoramaAudio.set('audio', audio.get('audio')); panoramaAudio.set('loop', audio.get('loop')); panoramaAudio.set('id', audio.get('id')); var stateChangeFunctions = audio.getBindings('stateChange'); for(var i = 0; i<stateChangeFunctions.length; ++i){ var f = stateChangeFunctions[i]; if(typeof f == 'string') f = new Function('event', f); panoramaAudio.bind('stateChange', f, this); } audio = panoramaAudio; } audios.push(audio); media.set('audios', audios); } return this.playGlobalAudio(audio, endCallback); },
  "triggerOverlay": function(overlay, eventName){  if(overlay.get('areas') != undefined) { var areas = overlay.get('areas'); for(var i = 0; i<areas.length; ++i) { areas[i].trigger(eventName); } } else { overlay.trigger(eventName); } },
  "setPanoramaCameraWithCurrentSpot": function(playListItem){  var currentPlayer = this.getActivePlayerWithViewer(this.MainViewer); if(currentPlayer == undefined){ return; } var playerClass = currentPlayer.get('class'); if(playerClass != 'PanoramaPlayer' && playerClass != 'Video360Player'){ return; } var fromMedia = currentPlayer.get('panorama'); if(fromMedia == undefined) { fromMedia = currentPlayer.get('video'); } var panorama = playListItem.get('media'); var newCamera = this.cloneCamera(playListItem.get('camera')); this.setCameraSameSpotAsMedia(newCamera, fromMedia); this.startPanoramaWithCamera(panorama, newCamera); },
  "fixTogglePlayPauseButton": function(player){  var state = player.get('state'); var buttons = player.get('buttonPlayPause'); if(typeof buttons !== 'undefined' && player.get('state') == 'playing'){ if(!Array.isArray(buttons)) buttons = [buttons]; for(var i = 0; i<buttons.length; ++i) buttons[i].set('pressed', true); } },
  "existsKey": function(key){  return key in window; },
  "getActivePlayerWithViewer": function(viewerArea){  var players = this.getByClassName('PanoramaPlayer'); players = players.concat(this.getByClassName('VideoPlayer')); players = players.concat(this.getByClassName('Video360Player')); players = players.concat(this.getByClassName('PhotoAlbumPlayer')); players = players.concat(this.getByClassName('MapPlayer')); var i = players.length; while(i-- > 0){ var player = players[i]; if(player.get('viewerArea') == viewerArea) { var playerClass = player.get('class'); if(playerClass == 'PanoramaPlayer' && (player.get('panorama') != undefined || player.get('video') != undefined)) return player; else if((playerClass == 'VideoPlayer' || playerClass == 'Video360Player') && player.get('video') != undefined) return player; else if(playerClass == 'PhotoAlbumPlayer' && player.get('photoAlbum') != undefined) return player; else if(playerClass == 'MapPlayer' && player.get('map') != undefined) return player; } } return undefined; },
  "pauseGlobalAudios": function(caller, exclude){  if (window.pauseGlobalAudiosState == undefined) window.pauseGlobalAudiosState = {}; if (window.pauseGlobalAudiosList == undefined) window.pauseGlobalAudiosList = []; if (caller in window.pauseGlobalAudiosState) { return; } var audios = this.getByClassName('Audio').concat(this.getByClassName('VideoPanoramaOverlay')); if (window.currentGlobalAudios != undefined) audios = audios.concat(Object.values(window.currentGlobalAudios)); var audiosPaused = []; var values = Object.values(window.pauseGlobalAudiosState); for (var i = 0, count = values.length; i<count; ++i) { var objAudios = values[i]; for (var j = 0; j<objAudios.length; ++j) { var a = objAudios[j]; if(audiosPaused.indexOf(a) == -1) audiosPaused.push(a); } } window.pauseGlobalAudiosState[caller] = audiosPaused; for (var i = 0, count = audios.length; i < count; ++i) { var a = audios[i]; if (a.get('state') == 'playing' && (exclude == undefined || exclude.indexOf(a) == -1)) { a.pause(); audiosPaused.push(a); } } },
  "setMediaBehaviour": function(playList, index, mediaDispatcher){  var self = this; var stateChangeFunction = function(event){ if(event.data.state == 'stopped'){ dispose.call(this, true); } }; var onBeginFunction = function() { item.unbind('begin', onBeginFunction, self); var media = item.get('media'); if(media.get('class') != 'Panorama' || (media.get('camera') != undefined && media.get('camera').get('initialSequence') != undefined)){ player.bind('stateChange', stateChangeFunction, self); } }; var changeFunction = function(){ var index = playListDispatcher.get('selectedIndex'); if(index != -1){ indexDispatcher = index; dispose.call(this, false); } }; var disposeCallback = function(){ dispose.call(this, false); }; var dispose = function(forceDispose){ if(!playListDispatcher) return; var media = item.get('media'); if((media.get('class') == 'Video360' || media.get('class') == 'Video') && media.get('loop') == true && !forceDispose) return; playList.set('selectedIndex', -1); if(panoramaSequence && panoramaSequenceIndex != -1){ if(panoramaSequence) { if(panoramaSequenceIndex > 0 && panoramaSequence.get('movements')[panoramaSequenceIndex-1].get('class') == 'TargetPanoramaCameraMovement'){ var initialPosition = camera.get('initialPosition'); var oldYaw = initialPosition.get('yaw'); var oldPitch = initialPosition.get('pitch'); var oldHfov = initialPosition.get('hfov'); var previousMovement = panoramaSequence.get('movements')[panoramaSequenceIndex-1]; initialPosition.set('yaw', previousMovement.get('targetYaw')); initialPosition.set('pitch', previousMovement.get('targetPitch')); initialPosition.set('hfov', previousMovement.get('targetHfov')); var restoreInitialPositionFunction = function(event){ initialPosition.set('yaw', oldYaw); initialPosition.set('pitch', oldPitch); initialPosition.set('hfov', oldHfov); itemDispatcher.unbind('end', restoreInitialPositionFunction, this); }; itemDispatcher.bind('end', restoreInitialPositionFunction, this); } panoramaSequence.set('movementIndex', panoramaSequenceIndex); } } if(player){ item.unbind('begin', onBeginFunction, this); player.unbind('stateChange', stateChangeFunction, this); for(var i = 0; i<buttons.length; ++i) { buttons[i].unbind('click', disposeCallback, this); } } if(sameViewerArea){ var currentMedia = this.getMediaFromPlayer(player); if(currentMedia == undefined || currentMedia == item.get('media')){ playListDispatcher.set('selectedIndex', indexDispatcher); } if(playList != playListDispatcher) playListDispatcher.unbind('change', changeFunction, this); } else{ viewerArea.set('visible', viewerVisibility); } playListDispatcher = undefined; }; var mediaDispatcherByParam = mediaDispatcher != undefined; if(!mediaDispatcher){ var currentIndex = playList.get('selectedIndex'); var currentPlayer = (currentIndex != -1) ? playList.get('items')[playList.get('selectedIndex')].get('player') : this.getActivePlayerWithViewer(this.MainViewer); if(currentPlayer) { mediaDispatcher = this.getMediaFromPlayer(currentPlayer); } } var playListDispatcher = mediaDispatcher ? this.getPlayListWithMedia(mediaDispatcher, true) : undefined; if(!playListDispatcher){ playList.set('selectedIndex', index); return; } var indexDispatcher = playListDispatcher.get('selectedIndex'); if(playList.get('selectedIndex') == index || indexDispatcher == -1){ return; } var item = playList.get('items')[index]; var itemDispatcher = playListDispatcher.get('items')[indexDispatcher]; var player = item.get('player'); var viewerArea = player.get('viewerArea'); var viewerVisibility = viewerArea.get('visible'); var sameViewerArea = viewerArea == itemDispatcher.get('player').get('viewerArea'); if(sameViewerArea){ if(playList != playListDispatcher){ playListDispatcher.set('selectedIndex', -1); playListDispatcher.bind('change', changeFunction, this); } } else{ viewerArea.set('visible', true); } var panoramaSequenceIndex = -1; var panoramaSequence = undefined; var camera = itemDispatcher.get('camera'); if(camera){ panoramaSequence = camera.get('initialSequence'); if(panoramaSequence) { panoramaSequenceIndex = panoramaSequence.get('movementIndex'); } } playList.set('selectedIndex', index); var buttons = []; var addButtons = function(property){ var value = player.get(property); if(value == undefined) return; if(Array.isArray(value)) buttons = buttons.concat(value); else buttons.push(value); }; addButtons('buttonStop'); for(var i = 0; i<buttons.length; ++i) { buttons[i].bind('click', disposeCallback, this); } if(player != itemDispatcher.get('player') || !mediaDispatcherByParam){ item.bind('begin', onBeginFunction, self); } this.executeFunctionWhenChange(playList, index, disposeCallback); },
  "setStartTimeVideoSync": function(video, player){  this.setStartTimeVideo(video, player.get('currentTime')); },
  "getMediaFromPlayer": function(player){  switch(player.get('class')){ case 'PanoramaPlayer': return player.get('panorama') || player.get('video'); case 'VideoPlayer': case 'Video360Player': return player.get('video'); case 'PhotoAlbumPlayer': return player.get('photoAlbum'); case 'MapPlayer': return player.get('map'); } },
  "showPopupPanoramaOverlay": function(popupPanoramaOverlay, closeButtonProperties, imageHD, toggleImage, toggleImageHD, autoCloseMilliSeconds, audio, stopBackgroundAudio){  var self = this; this.MainViewer.set('toolTipEnabled', false); var cardboardEnabled = this.isCardboardViewMode(); if(!cardboardEnabled) { var zoomImage = this.zoomImagePopupPanorama; var showDuration = popupPanoramaOverlay.get('showDuration'); var hideDuration = popupPanoramaOverlay.get('hideDuration'); var playersPaused = this.pauseCurrentPlayers(audio == null || !stopBackgroundAudio); var popupMaxWidthBackup = popupPanoramaOverlay.get('popupMaxWidth'); var popupMaxHeightBackup = popupPanoramaOverlay.get('popupMaxHeight'); var showEndFunction = function() { var loadedFunction = function(){ if(!self.isCardboardViewMode()) popupPanoramaOverlay.set('visible', false); }; popupPanoramaOverlay.unbind('showEnd', showEndFunction, self); popupPanoramaOverlay.set('showDuration', 1); popupPanoramaOverlay.set('hideDuration', 1); self.showPopupImage(imageHD, toggleImageHD, popupPanoramaOverlay.get('popupMaxWidth'), popupPanoramaOverlay.get('popupMaxHeight'), null, null, closeButtonProperties, autoCloseMilliSeconds, audio, stopBackgroundAudio, loadedFunction, hideFunction); }; var hideFunction = function() { var restoreShowDurationFunction = function(){ popupPanoramaOverlay.unbind('showEnd', restoreShowDurationFunction, self); popupPanoramaOverlay.set('visible', false); popupPanoramaOverlay.set('showDuration', showDuration); popupPanoramaOverlay.set('popupMaxWidth', popupMaxWidthBackup); popupPanoramaOverlay.set('popupMaxHeight', popupMaxHeightBackup); }; self.resumePlayers(playersPaused, audio == null || !stopBackgroundAudio); var currentWidth = zoomImage.get('imageWidth'); var currentHeight = zoomImage.get('imageHeight'); popupPanoramaOverlay.bind('showEnd', restoreShowDurationFunction, self, true); popupPanoramaOverlay.set('showDuration', 1); popupPanoramaOverlay.set('hideDuration', hideDuration); popupPanoramaOverlay.set('popupMaxWidth', currentWidth); popupPanoramaOverlay.set('popupMaxHeight', currentHeight); if(popupPanoramaOverlay.get('visible')) restoreShowDurationFunction(); else popupPanoramaOverlay.set('visible', true); self.MainViewer.set('toolTipEnabled', true); }; if(!imageHD){ imageHD = popupPanoramaOverlay.get('image'); } if(!toggleImageHD && toggleImage){ toggleImageHD = toggleImage; } popupPanoramaOverlay.bind('showEnd', showEndFunction, this, true); } else { var hideEndFunction = function() { self.resumePlayers(playersPaused, audio == null || stopBackgroundAudio); if(audio){ if(stopBackgroundAudio){ self.resumeGlobalAudios(); } self.stopGlobalAudio(audio); } popupPanoramaOverlay.unbind('hideEnd', hideEndFunction, self); self.MainViewer.set('toolTipEnabled', true); }; var playersPaused = this.pauseCurrentPlayers(audio == null || !stopBackgroundAudio); if(audio){ if(stopBackgroundAudio){ this.pauseGlobalAudios(); } this.playGlobalAudio(audio); } popupPanoramaOverlay.bind('hideEnd', hideEndFunction, this, true); } popupPanoramaOverlay.set('visible', true); },
  "getPanoramaOverlayByName": function(panorama, name){  var overlays = this.getOverlays(panorama); for(var i = 0, count = overlays.length; i<count; ++i){ var overlay = overlays[i]; var data = overlay.get('data'); if(data != undefined && data.label == name){ return overlay; } } return undefined; },
  "startPanoramaWithCamera": function(media, camera){  if(window.currentPanoramasWithCameraChanged != undefined && window.currentPanoramasWithCameraChanged.indexOf(media) != -1){ return; } var playLists = this.getByClassName('PlayList'); if(playLists.length == 0) return; var restoreItems = []; for(var i = 0, count = playLists.length; i<count; ++i){ var playList = playLists[i]; var items = playList.get('items'); for(var j = 0, countJ = items.length; j<countJ; ++j){ var item = items[j]; if(item.get('media') == media && (item.get('class') == 'PanoramaPlayListItem' || item.get('class') == 'Video360PlayListItem')){ restoreItems.push({camera: item.get('camera'), item: item}); item.set('camera', camera); } } } if(restoreItems.length > 0) { if(window.currentPanoramasWithCameraChanged == undefined) { window.currentPanoramasWithCameraChanged = [media]; } else { window.currentPanoramasWithCameraChanged.push(media); } var restoreCameraOnStop = function(){ var index = window.currentPanoramasWithCameraChanged.indexOf(media); if(index != -1) { window.currentPanoramasWithCameraChanged.splice(index, 1); } for (var i = 0; i < restoreItems.length; i++) { restoreItems[i].item.set('camera', restoreItems[i].camera); restoreItems[i].item.unbind('stop', restoreCameraOnStop, this); } }; for (var i = 0; i < restoreItems.length; i++) { restoreItems[i].item.bind('stop', restoreCameraOnStop, this); } } },
  "shareFacebook": function(url){  window.open('https://www.facebook.com/sharer/sharer.php?u=' + url, '_blank'); },
  "playGlobalAudio": function(audio, endCallback){  var endFunction = function(){ audio.unbind('end', endFunction, this); this.stopGlobalAudio(audio); if(endCallback) endCallback(); }; audio = this.getGlobalAudio(audio); var audios = window.currentGlobalAudios; if(!audios){ audios = window.currentGlobalAudios = {}; } audios[audio.get('id')] = audio; if(audio.get('state') == 'playing'){ return audio; } if(!audio.get('loop')){ audio.bind('end', endFunction, this); } audio.play(); return audio; },
  "setCameraSameSpotAsMedia": function(camera, media){  var player = this.getCurrentPlayerWithMedia(media); if(player != undefined) { var position = camera.get('initialPosition'); position.set('yaw', player.get('yaw')); position.set('pitch', player.get('pitch')); position.set('hfov', player.get('hfov')); } },
  "showComponentsWhileMouseOver": function(parentComponent, components, durationVisibleWhileOut){  var setVisibility = function(visible){ for(var i = 0, length = components.length; i<length; i++){ var component = components[i]; if(component.get('class') == 'HTMLText' && (component.get('html') == '' || component.get('html') == undefined)) { continue; } component.set('visible', visible); } }; if (this.rootPlayer.get('touchDevice') == true){ setVisibility(true); } else { var timeoutID = -1; var rollOverFunction = function(){ setVisibility(true); if(timeoutID >= 0) clearTimeout(timeoutID); parentComponent.unbind('rollOver', rollOverFunction, this); parentComponent.bind('rollOut', rollOutFunction, this); }; var rollOutFunction = function(){ var timeoutFunction = function(){ setVisibility(false); parentComponent.unbind('rollOver', rollOverFunction, this); }; parentComponent.unbind('rollOut', rollOutFunction, this); parentComponent.bind('rollOver', rollOverFunction, this); timeoutID = setTimeout(timeoutFunction, durationVisibleWhileOut); }; parentComponent.bind('rollOver', rollOverFunction, this); } },
  "showPopupMedia": function(w, media, playList, popupMaxWidth, popupMaxHeight, autoCloseWhenFinished, stopAudios){  var self = this; var closeFunction = function(){ playList.set('selectedIndex', -1); self.MainViewer.set('toolTipEnabled', true); if(stopAudios) { self.resumeGlobalAudios(); } this.resumePlayers(playersPaused, !stopAudios); if(isVideo) { this.unbind('resize', resizeFunction, this); } w.unbind('close', closeFunction, this); }; var endFunction = function(){ w.hide(); }; var resizeFunction = function(){ var getWinValue = function(property){ return w.get(property) || 0; }; var parentWidth = self.get('actualWidth'); var parentHeight = self.get('actualHeight'); var mediaWidth = self.getMediaWidth(media); var mediaHeight = self.getMediaHeight(media); var popupMaxWidthNumber = parseFloat(popupMaxWidth) / 100; var popupMaxHeightNumber = parseFloat(popupMaxHeight) / 100; var windowWidth = popupMaxWidthNumber * parentWidth; var windowHeight = popupMaxHeightNumber * parentHeight; var footerHeight = getWinValue('footerHeight'); var headerHeight = getWinValue('headerHeight'); if(!headerHeight) { var closeButtonHeight = getWinValue('closeButtonIconHeight') + getWinValue('closeButtonPaddingTop') + getWinValue('closeButtonPaddingBottom'); var titleHeight = self.getPixels(getWinValue('titleFontSize')) + getWinValue('titlePaddingTop') + getWinValue('titlePaddingBottom'); headerHeight = closeButtonHeight > titleHeight ? closeButtonHeight : titleHeight; headerHeight += getWinValue('headerPaddingTop') + getWinValue('headerPaddingBottom'); } var contentWindowWidth = windowWidth - getWinValue('bodyPaddingLeft') - getWinValue('bodyPaddingRight') - getWinValue('paddingLeft') - getWinValue('paddingRight'); var contentWindowHeight = windowHeight - headerHeight - footerHeight - getWinValue('bodyPaddingTop') - getWinValue('bodyPaddingBottom') - getWinValue('paddingTop') - getWinValue('paddingBottom'); var parentAspectRatio = contentWindowWidth / contentWindowHeight; var mediaAspectRatio = mediaWidth / mediaHeight; if(parentAspectRatio > mediaAspectRatio) { windowWidth = contentWindowHeight * mediaAspectRatio + getWinValue('bodyPaddingLeft') + getWinValue('bodyPaddingRight') + getWinValue('paddingLeft') + getWinValue('paddingRight'); } else { windowHeight = contentWindowWidth / mediaAspectRatio + headerHeight + footerHeight + getWinValue('bodyPaddingTop') + getWinValue('bodyPaddingBottom') + getWinValue('paddingTop') + getWinValue('paddingBottom'); } if(windowWidth > parentWidth * popupMaxWidthNumber) { windowWidth = parentWidth * popupMaxWidthNumber; } if(windowHeight > parentHeight * popupMaxHeightNumber) { windowHeight = parentHeight * popupMaxHeightNumber; } w.set('width', windowWidth); w.set('height', windowHeight); w.set('x', (parentWidth - getWinValue('actualWidth')) * 0.5); w.set('y', (parentHeight - getWinValue('actualHeight')) * 0.5); }; if(autoCloseWhenFinished){ this.executeFunctionWhenChange(playList, 0, endFunction); } var mediaClass = media.get('class'); var isVideo = mediaClass == 'Video' || mediaClass == 'Video360'; playList.set('selectedIndex', 0); if(isVideo){ this.bind('resize', resizeFunction, this); resizeFunction(); playList.get('items')[0].get('player').play(); } else { w.set('width', popupMaxWidth); w.set('height', popupMaxHeight); } this.MainViewer.set('toolTipEnabled', false); if(stopAudios) { this.pauseGlobalAudios(); } var playersPaused = this.pauseCurrentPlayers(!stopAudios); w.bind('close', closeFunction, this); w.show(this, true); },
  "getPlayListWithMedia": function(media, onlySelected){  var playLists = this.getByClassName('PlayList'); for(var i = 0, count = playLists.length; i<count; ++i){ var playList = playLists[i]; if(onlySelected && playList.get('selectedIndex') == -1) continue; if(this.getPlayListItemByMedia(playList, media) != undefined) return playList; } return undefined; },
  "setMapLocation": function(panoramaPlayListItem, mapPlayer){  var resetFunction = function(){ panoramaPlayListItem.unbind('stop', resetFunction, this); player.set('mapPlayer', null); }; panoramaPlayListItem.bind('stop', resetFunction, this); var player = panoramaPlayListItem.get('player'); player.set('mapPlayer', mapPlayer); },
  "setEndToItemIndex": function(playList, fromIndex, toIndex){  var endFunction = function(){ if(playList.get('selectedIndex') == fromIndex) playList.set('selectedIndex', toIndex); }; this.executeFunctionWhenChange(playList, fromIndex, endFunction); },
  "updateVideoCues": function(playList, index){  var playListItem = playList.get('items')[index]; var video = playListItem.get('media'); if(video.get('cues').length == 0) return; var player = playListItem.get('player'); var cues = []; var changeFunction = function(){ if(playList.get('selectedIndex') != index){ video.unbind('cueChange', cueChangeFunction, this); playList.unbind('change', changeFunction, this); } }; var cueChangeFunction = function(event){ var activeCues = event.data.activeCues; for(var i = 0, count = cues.length; i<count; ++i){ var cue = cues[i]; if(activeCues.indexOf(cue) == -1 && (cue.get('startTime') > player.get('currentTime') || cue.get('endTime') < player.get('currentTime')+0.5)){ cue.trigger('end'); } } cues = activeCues; }; video.bind('cueChange', cueChangeFunction, this); playList.bind('change', changeFunction, this); },
  "pauseGlobalAudio": function(audio){  var audios = window.currentGlobalAudios; if(audios){ audio = audios[audio.get('id')]; } if(audio.get('state') == 'playing') audio.pause(); },
  "showPopupImage": function(image, toggleImage, customWidth, customHeight, showEffect, hideEffect, closeButtonProperties, autoCloseMilliSeconds, audio, stopBackgroundAudio, loadedCallback, hideCallback){  var self = this; var closed = false; var playerClickFunction = function() { zoomImage.unbind('loaded', loadedFunction, self); hideFunction(); }; var clearAutoClose = function(){ zoomImage.unbind('click', clearAutoClose, this); if(timeoutID != undefined){ clearTimeout(timeoutID); } }; var resizeFunction = function(){ setTimeout(setCloseButtonPosition, 0); }; var loadedFunction = function(){ self.unbind('click', playerClickFunction, self); veil.set('visible', true); setCloseButtonPosition(); closeButton.set('visible', true); zoomImage.unbind('loaded', loadedFunction, this); zoomImage.bind('userInteractionStart', userInteractionStartFunction, this); zoomImage.bind('userInteractionEnd', userInteractionEndFunction, this); zoomImage.bind('resize', resizeFunction, this); timeoutID = setTimeout(timeoutFunction, 200); }; var timeoutFunction = function(){ timeoutID = undefined; if(autoCloseMilliSeconds){ var autoCloseFunction = function(){ hideFunction(); }; zoomImage.bind('click', clearAutoClose, this); timeoutID = setTimeout(autoCloseFunction, autoCloseMilliSeconds); } zoomImage.bind('backgroundClick', hideFunction, this); if(toggleImage) { zoomImage.bind('click', toggleFunction, this); zoomImage.set('imageCursor', 'hand'); } closeButton.bind('click', hideFunction, this); if(loadedCallback) loadedCallback(); }; var hideFunction = function() { self.MainViewer.set('toolTipEnabled', true); closed = true; if(timeoutID) clearTimeout(timeoutID); if (timeoutUserInteractionID) clearTimeout(timeoutUserInteractionID); if(autoCloseMilliSeconds) clearAutoClose(); if(hideCallback) hideCallback(); zoomImage.set('visible', false); if(hideEffect && hideEffect.get('duration') > 0){ hideEffect.bind('end', endEffectFunction, this); } else{ zoomImage.set('image', null); } closeButton.set('visible', false); veil.set('visible', false); self.unbind('click', playerClickFunction, self); zoomImage.unbind('backgroundClick', hideFunction, this); zoomImage.unbind('userInteractionStart', userInteractionStartFunction, this); zoomImage.unbind('userInteractionEnd', userInteractionEndFunction, this, true); zoomImage.unbind('resize', resizeFunction, this); if(toggleImage) { zoomImage.unbind('click', toggleFunction, this); zoomImage.set('cursor', 'default'); } closeButton.unbind('click', hideFunction, this); self.resumePlayers(playersPaused, audio == null || stopBackgroundAudio); if(audio){ if(stopBackgroundAudio){ self.resumeGlobalAudios(); } self.stopGlobalAudio(audio); } }; var endEffectFunction = function() { zoomImage.set('image', null); hideEffect.unbind('end', endEffectFunction, this); }; var toggleFunction = function() { zoomImage.set('image', isToggleVisible() ? image : toggleImage); }; var isToggleVisible = function() { return zoomImage.get('image') == toggleImage; }; var setCloseButtonPosition = function() { var right = zoomImage.get('actualWidth') - zoomImage.get('imageLeft') - zoomImage.get('imageWidth') + 10; var top = zoomImage.get('imageTop') + 10; if(right < 10) right = 10; if(top < 10) top = 10; closeButton.set('right', right); closeButton.set('top', top); }; var userInteractionStartFunction = function() { if(timeoutUserInteractionID){ clearTimeout(timeoutUserInteractionID); timeoutUserInteractionID = undefined; } else{ closeButton.set('visible', false); } }; var userInteractionEndFunction = function() { if(!closed){ timeoutUserInteractionID = setTimeout(userInteractionTimeoutFunction, 300); } }; var userInteractionTimeoutFunction = function() { timeoutUserInteractionID = undefined; closeButton.set('visible', true); setCloseButtonPosition(); }; this.MainViewer.set('toolTipEnabled', false); var veil = this.veilPopupPanorama; var zoomImage = this.zoomImagePopupPanorama; var closeButton = this.closeButtonPopupPanorama; if(closeButtonProperties){ for(var key in closeButtonProperties){ closeButton.set(key, closeButtonProperties[key]); } } var playersPaused = this.pauseCurrentPlayers(audio == null || !stopBackgroundAudio); if(audio){ if(stopBackgroundAudio){ this.pauseGlobalAudios(); } this.playGlobalAudio(audio); } var timeoutID = undefined; var timeoutUserInteractionID = undefined; zoomImage.bind('loaded', loadedFunction, this); setTimeout(function(){ self.bind('click', playerClickFunction, self, false); }, 0); zoomImage.set('image', image); zoomImage.set('customWidth', customWidth); zoomImage.set('customHeight', customHeight); zoomImage.set('showEffect', showEffect); zoomImage.set('hideEffect', hideEffect); zoomImage.set('visible', true); return zoomImage; },
  "syncPlaylists": function(playLists){  var changeToMedia = function(media, playListDispatched){ for(var i = 0, count = playLists.length; i<count; ++i){ var playList = playLists[i]; if(playList != playListDispatched){ var items = playList.get('items'); for(var j = 0, countJ = items.length; j<countJ; ++j){ if(items[j].get('media') == media){ if(playList.get('selectedIndex') != j){ playList.set('selectedIndex', j); } break; } } } } }; var changeFunction = function(event){ var playListDispatched = event.source; var selectedIndex = playListDispatched.get('selectedIndex'); if(selectedIndex < 0) return; var media = playListDispatched.get('items')[selectedIndex].get('media'); changeToMedia(media, playListDispatched); }; var mapPlayerChangeFunction = function(event){ var panoramaMapLocation = event.source.get('panoramaMapLocation'); if(panoramaMapLocation){ var map = panoramaMapLocation.get('map'); changeToMedia(map); } }; for(var i = 0, count = playLists.length; i<count; ++i){ playLists[i].bind('change', changeFunction, this); } var mapPlayers = this.getByClassName('MapPlayer'); for(var i = 0, count = mapPlayers.length; i<count; ++i){ mapPlayers[i].bind('panoramaMapLocation_change', mapPlayerChangeFunction, this); } },
  "setOverlayBehaviour": function(overlay, media, action){  var executeFunc = function() { switch(action){ case 'triggerClick': this.triggerOverlay(overlay, 'click'); break; case 'stop': case 'play': case 'pause': overlay[action](); break; case 'togglePlayPause': case 'togglePlayStop': if(overlay.get('state') == 'playing') overlay[action == 'togglePlayPause' ? 'pause' : 'stop'](); else overlay.play(); break; } if(window.overlaysDispatched == undefined) window.overlaysDispatched = {}; var id = overlay.get('id'); window.overlaysDispatched[id] = true; setTimeout(function(){ delete window.overlaysDispatched[id]; }, 2000); }; if(window.overlaysDispatched != undefined && overlay.get('id') in window.overlaysDispatched) return; var playList = this.getPlayListWithMedia(media, true); if(playList != undefined){ var item = this.getPlayListItemByMedia(playList, media); if(playList.get('items').indexOf(item) != playList.get('selectedIndex')){ var beginFunc = function(e){ item.unbind('begin', beginFunc, this); executeFunc.call(this); }; item.bind('begin', beginFunc, this); return; } } executeFunc.call(this); },
  "shareTwitter": function(url){  window.open('https://twitter.com/intent/tweet?source=webclient&url=' + url, '_blank'); },
  "stopAndGoCamera": function(camera, ms){  var sequence = camera.get('initialSequence'); sequence.pause(); var timeoutFunction = function(){ sequence.play(); }; setTimeout(timeoutFunction, ms); },
  "openLink": function(url, name){  if(url == location.href) { return; } var isElectron = (window && window.process && window.process.versions && window.process.versions['electron']) || (navigator && navigator.userAgent && navigator.userAgent.indexOf('Electron') >= 0); if (name == '_blank' && isElectron) { if (url.startsWith('/')) { var r = window.location.href.split('/'); r.pop(); url = r.join('/') + url; } var extension = url.split('.').pop().toLowerCase(); if(extension != 'pdf' || url.startsWith('file://')) { var shell = window.require('electron').shell; shell.openExternal(url); } else { window.open(url, name); } } else if(isElectron && (name == '_top' || name == '_self')) { window.location = url; } else { var newWindow = window.open(url, name); newWindow.focus(); } },
  "getKey": function(key){  return window[key]; }
 },
 "verticalAlign": "top",
 "paddingBottom": 0,
 "scrollBarOpacity": 0.5,
 "scrollBarMargin": 2,
 "contentOpaque": false,
 "defaultVRPointer": "laser",
 "height": "100%",
 "downloadEnabled": false,
 "shadow": false,
 "gap": 10,
 "paddingRight": 0,
 "borderRadius": 0,
 "horizontalAlign": "left",
 "paddingTop": 0,
 "overflow": "visible",
 "definitions": [{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ]
 },
 "id": "panorama_266A36EB_2C3C_C45D_41A9_B83C69110285_camera"
},
{
 "viewerArea": "this.MainViewer",
 "class": "PanoramaPlayer",
 "displayPlaybackBar": true,
 "touchControlMode": "drag_rotation",
 "id": "MainViewerPanoramaPlayer",
 "gyroscopeVerticalDraggingEnabled": true,
 "buttonToggleGyroscope": "this.IconButton_8890AD7C_AF3A_A716_41D7_D5ACF7CBB89B",
 "mouseControlMode": "drag_acceleration"
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": -51.88,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ]
 },
 "id": "camera_880D4C90_AF0B_65EE_41DB_91D6DAF4D5A6"
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": 58.53,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ]
 },
 "id": "camera_8806ECAE_AF0B_6532_41E5_3414F2C8D303"
},
{
 "items": [
  {
   "media": "this.panorama_2650731A_2C3C_7DFF_41BF_42020C9917DD",
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 0, 1)",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_2650731A_2C3C_7DFF_41BF_42020C9917DD_camera"
  },
  {
   "media": "this.panorama_274E4A2E_2C3D_CFD7_41C3_E749466BFD9F",
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 1, 2)",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_274E4A2E_2C3D_CFD7_41C3_E749466BFD9F_camera"
  },
  {
   "media": "this.panorama_26667EAB_2C3C_44DC_41BD_508AF18BD0E5",
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 2, 3)",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_26667EAB_2C3C_44DC_41BD_508AF18BD0E5_camera"
  },
  {
   "media": "this.panorama_266A48C5_2C3C_4C55_41B3_1D70C2050903",
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 3, 4)",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_266A48C5_2C3C_4C55_41B3_1D70C2050903_camera"
  },
  {
   "media": "this.panorama_266A2362_2C3C_7C4F_41C5_86D5259F47A8",
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 4, 5)",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_266A2362_2C3C_7C4F_41C5_86D5259F47A8_camera"
  },
  {
   "media": "this.panorama_266A5CEF_2C3C_4455_41A5_2CBA724838F2",
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 5, 6)",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_266A5CEF_2C3C_4455_41A5_2CBA724838F2_camera"
  },
  {
   "media": "this.panorama_2666CCAC_2C3C_C4D4_41B6_6F5BD1BACD46",
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 6, 7)",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_2666CCAC_2C3C_C4D4_41B6_6F5BD1BACD46_camera"
  },
  {
   "media": "this.panorama_2666F3DA_2C3C_BC7F_41A5_8719A461067F",
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 7, 8)",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_2666F3DA_2C3C_BC7F_41A5_8719A461067F_camera"
  },
  {
   "media": "this.panorama_26663B80_2C3C_4CCC_41C4_05539F545C2A",
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 8, 9)",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_26663B80_2C3C_4CCC_41C4_05539F545C2A_camera"
  },
  {
   "media": "this.panorama_26664293_2C3C_5CCD_41B6_BA5F5C9DBD4C",
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 9, 10)",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_26664293_2C3C_5CCD_41B6_BA5F5C9DBD4C_camera"
  },
  {
   "media": "this.panorama_2666F540_2C3C_C44C_41C0_1FA76F1EECB2",
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 10, 11)",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_2666F540_2C3C_C44C_41C0_1FA76F1EECB2_camera"
  },
  {
   "media": "this.panorama_26660E76_2C3C_C437_41C0_4932F3D787B3",
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 11, 12)",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_26660E76_2C3C_C437_41C0_4932F3D787B3_camera"
  },
  {
   "media": "this.panorama_2640B699_2C3C_C4FC_4199_0A1F70F8E313",
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 12, 13)",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_2640B699_2C3C_C4FC_4199_0A1F70F8E313_camera"
  },
  {
   "media": "this.panorama_266A40B1_2C3C_7CCD_41B2_B5FCEE869E17",
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 13, 14)",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_266A40B1_2C3C_7CCD_41B2_B5FCEE869E17_camera"
  },
  {
   "media": "this.panorama_26667DFA_2C3C_443C_41B2_332913C8F61A",
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 14, 15)",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_26667DFA_2C3C_443C_41B2_332913C8F61A_camera"
  },
  {
   "media": "this.panorama_266A5334_2C3C_BDCB_41C0_5ECFC0F03DE9",
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 15, 16)",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_266A5334_2C3C_BDCB_41C0_5ECFC0F03DE9_camera"
  },
  {
   "media": "this.panorama_266ACC21_2C3C_CBCD_41B6_407672D395B3",
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 16, 17)",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_266ACC21_2C3C_CBCD_41B6_407672D395B3_camera"
  },
  {
   "media": "this.panorama_266A4FDB_2C3C_447D_41C1_296818159F21",
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 17, 18)",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_266A4FDB_2C3C_447D_41C1_296818159F21_camera"
  },
  {
   "media": "this.panorama_266A7DB6_2C3C_4437_41C1_235AEE268532",
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 18, 19)",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_266A7DB6_2C3C_4437_41C1_235AEE268532_camera"
  },
  {
   "media": "this.panorama_2669A39A_2C3C_5CFF_41C0_F596914DA092",
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 19, 20)",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_2669A39A_2C3C_5CFF_41C0_F596914DA092_camera"
  },
  {
   "media": "this.panorama_2669B134_2C3F_DDCB_41BB_88BE90D98D45",
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 20, 21)",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_2669B134_2C3F_DDCB_41BB_88BE90D98D45_camera"
  },
  {
   "media": "this.panorama_2669CA02_2C3F_CFCF_41C1_E694A5B56234",
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 21, 22)",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_2669CA02_2C3F_CFCF_41C1_E694A5B56234_camera"
  },
  {
   "media": "this.panorama_2669D8F8_2C3F_CC3B_41C4_43F82B11C465",
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 22, 23)",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_2669D8F8_2C3F_CC3B_41C4_43F82B11C465_camera"
  },
  {
   "media": "this.panorama_2669E37C_2C3F_DC3B_41AF_EA365FC497F6",
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 23, 24)",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_2669E37C_2C3F_DC3B_41AF_EA365FC497F6_camera"
  },
  {
   "media": "this.panorama_266659AF_2C3C_4CD5_41A2_2211D54F0994",
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 24, 25)",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_266659AF_2C3C_4CD5_41A2_2211D54F0994_camera"
  },
  {
   "media": "this.panorama_266AF94D_2C3C_CC54_4196_59CC1A2DCC79",
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 25, 26)",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_266AF94D_2C3C_CC54_4196_59CC1A2DCC79_camera"
  },
  {
   "media": "this.panorama_266ACD16_2C3C_C5F4_41C4_48EB0653785E",
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 26, 27)",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_266ACD16_2C3C_C5F4_41C4_48EB0653785E_camera"
  },
  {
   "media": "this.panorama_266A36EB_2C3C_C45D_41A9_B83C69110285",
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 27, 28)",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_266A36EB_2C3C_C45D_41A9_B83C69110285_camera"
  },
  {
   "media": "this.panorama_266ABC73_2C3C_444D_41A2_D12FEAAC1356",
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 28, 29)",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_266ABC73_2C3C_444D_41A2_D12FEAAC1356_camera"
  },
  {
   "media": "this.panorama_266AA6A9_2C3C_44DD_4132_A3FBEF2422DE",
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 29, 30)",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_266AA6A9_2C3C_44DD_4132_A3FBEF2422DE_camera"
  },
  {
   "media": "this.panorama_2669CEC5_2C3F_C455_41C1_4FFEA2873441",
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 30, 31)",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_2669CEC5_2C3F_C455_41C1_4FFEA2873441_camera"
  },
  {
   "media": "this.panorama_264C2F16_2C3C_C5F7_41C0_5EA2911E8144",
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 31, 32)",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_264C2F16_2C3C_C5F7_41C0_5EA2911E8144_camera"
  },
  {
   "media": "this.panorama_26666712_2C3C_C5CF_4198_822E2A8C8DCC",
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 32, 33)",
   "player": "this.MainViewerPanoramaPlayer",
   "camera": "this.panorama_26666712_2C3C_C5CF_4198_822E2A8C8DCC_camera"
  },
  {
   "media": "this.panorama_26661FEC_2C3C_C45B_419B_861471116CC7",
   "camera": "this.panorama_26661FEC_2C3C_C45B_419B_861471116CC7_camera",
   "class": "PanoramaPlayListItem",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 33, 0)",
   "player": "this.MainViewerPanoramaPlayer",
   "end": "this.trigger('tourEnded')"
  }
 ],
 "id": "mainPlayList",
 "class": "PlayList"
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": 78.13,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ]
 },
 "id": "camera_870ABDFA_AF0B_6712_41DE_E10EE09D9171"
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": -75.37,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ]
 },
 "id": "camera_87504DD1_AF0B_676E_41DA_4A11711717A7"
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ]
 },
 "id": "panorama_266A40B1_2C3C_7CCD_41B2_B5FCEE869E17_camera"
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": 77.75,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ]
 },
 "id": "camera_874D6DBC_AF0B_6716_41B6_E530D314E39E"
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": -100.2,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ]
 },
 "id": "camera_86265EF5_AF0B_6516_41D0_6A01BC4FFE18"
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ]
 },
 "id": "panorama_26667DFA_2C3C_443C_41B2_332913C8F61A_camera"
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": 152.13,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ]
 },
 "id": "camera_864E5ED4_AF0B_6516_41E1_A19C9DBA2DFA"
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": 104.51,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ]
 },
 "id": "camera_8635CEFF_AF0B_6512_41E0_FF26BCD983BC"
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": -111.51,
  "class": "PanoramaCameraPosition",
  "pitch": 3.93
 },
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ]
 },
 "id": "panorama_2650731A_2C3C_7DFF_41BF_42020C9917DD_camera"
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": 158.02,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ]
 },
 "id": "camera_87CC0D19_AF0B_671E_41E3_E4C8668280BE"
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": 82.78,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ]
 },
 "id": "camera_858AAF6D_AF0B_6336_41E5_B6C643F9FE61"
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": -23.64,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ]
 },
 "id": "camera_86283EEA_AF0B_6532_41DA_924D1E91A9B5"
},
{
 "adjacentPanoramas": [
  {
   "yaw": -102.25,
   "backwardYaw": -75.13,
   "distance": 1,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_264C2F16_2C3C_C5F7_41C0_5EA2911E8144"
  },
  {
   "yaw": 3.89,
   "backwardYaw": 133.9,
   "distance": 1,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_26667EAB_2C3C_44DC_41BD_508AF18BD0E5"
  },
  {
   "yaw": 137.29,
   "backwardYaw": -21.98,
   "distance": 1,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_266A2362_2C3C_7C4F_41C5_86D5259F47A8"
  },
  {
   "yaw": -156.89,
   "backwardYaw": -21.98,
   "distance": 1,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_266A2362_2C3C_7C4F_41C5_86D5259F47A8"
  }
 ],
 "thumbnailUrl": "media/panorama_266A48C5_2C3C_4C55_41B3_1D70C2050903_t.jpg",
 "hfov": 360,
 "partial": false,
 "id": "panorama_266A48C5_2C3C_4C55_41B3_1D70C2050903",
 "label": "IMG_20220316_103904_00_326",
 "pitch": 0,
 "hfovMax": 130,
 "class": "Panorama",
 "vfov": 180,
 "frames": [
  {
   "front": {
    "levels": [
     {
      "url": "media/panorama_266A48C5_2C3C_4C55_41B3_1D70C2050903_0/f/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "width": 2048,
      "colCount": 4,
      "height": 2048,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_266A48C5_2C3C_4C55_41B3_1D70C2050903_0/f/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2,
      "height": 1024,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_266A48C5_2C3C_4C55_41B3_1D70C2050903_0/f/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ]
     }
    ],
    "class": "ImageResource"
   },
   "top": {
    "levels": [
     {
      "url": "media/panorama_266A48C5_2C3C_4C55_41B3_1D70C2050903_0/u/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "width": 2048,
      "colCount": 4,
      "height": 2048,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_266A48C5_2C3C_4C55_41B3_1D70C2050903_0/u/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2,
      "height": 1024,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_266A48C5_2C3C_4C55_41B3_1D70C2050903_0/u/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ]
     }
    ],
    "class": "ImageResource"
   },
   "right": {
    "levels": [
     {
      "url": "media/panorama_266A48C5_2C3C_4C55_41B3_1D70C2050903_0/r/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "width": 2048,
      "colCount": 4,
      "height": 2048,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_266A48C5_2C3C_4C55_41B3_1D70C2050903_0/r/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2,
      "height": 1024,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_266A48C5_2C3C_4C55_41B3_1D70C2050903_0/r/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ]
     }
    ],
    "class": "ImageResource"
   },
   "back": {
    "levels": [
     {
      "url": "media/panorama_266A48C5_2C3C_4C55_41B3_1D70C2050903_0/b/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "width": 2048,
      "colCount": 4,
      "height": 2048,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_266A48C5_2C3C_4C55_41B3_1D70C2050903_0/b/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2,
      "height": 1024,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_266A48C5_2C3C_4C55_41B3_1D70C2050903_0/b/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ]
     }
    ],
    "class": "ImageResource"
   },
   "bottom": {
    "levels": [
     {
      "url": "media/panorama_266A48C5_2C3C_4C55_41B3_1D70C2050903_0/d/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "width": 2048,
      "colCount": 4,
      "height": 2048,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_266A48C5_2C3C_4C55_41B3_1D70C2050903_0/d/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2,
      "height": 1024,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_266A48C5_2C3C_4C55_41B3_1D70C2050903_0/d/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ]
     }
    ],
    "class": "ImageResource"
   },
   "left": {
    "levels": [
     {
      "url": "media/panorama_266A48C5_2C3C_4C55_41B3_1D70C2050903_0/l/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "width": 2048,
      "colCount": 4,
      "height": 2048,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_266A48C5_2C3C_4C55_41B3_1D70C2050903_0/l/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2,
      "height": 1024,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_266A48C5_2C3C_4C55_41B3_1D70C2050903_0/l/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ]
     }
    ],
    "class": "ImageResource"
   },
   "class": "CubicPanoramaFrame",
   "thumbnailUrl": "media/panorama_266A48C5_2C3C_4C55_41B3_1D70C2050903_t.jpg"
  }
 ],
 "hfovMin": "135%",
 "overlays": [
  "this.overlay_3F7F7E3E_2CC4_C437_418B_1B3C30DCF9D9",
  "this.overlay_3A5E17BB_2CC4_443D_419B_A48975CA6E16",
  "this.overlay_39C695A0_2CCC_44CB_41A9_6B28A42A96B1",
  "this.overlay_393B0602_2CDC_C7CF_41A2_9234B59A3EB3",
  "this.overlay_42B6D692_557A_A8DB_41C0_F4A8AEA6FF46",
  "this.panorama_266A48C5_2C3C_4C55_41B3_1D70C2050903_tcap0",
  "this.overlay_8EEB2741_AF0A_A36E_41D6_496E6189138A",
  "this.overlay_B25E885B_AF0A_ED12_41D5_0B9187259236"
 ]
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": 88.68,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ]
 },
 "id": "camera_85659FA7_AF0B_6332_41E0_41FD7C7BA1FD"
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ]
 },
 "id": "panorama_2669B134_2C3F_DDCB_41BB_88BE90D98D45_camera"
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ]
 },
 "id": "panorama_2666F540_2C3C_C44C_41C0_1FA76F1EECB2_camera"
},
{
 "adjacentPanoramas": [
  {
   "yaw": -97.22,
   "backwardYaw": 143.07,
   "distance": 1,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_266A5334_2C3C_BDCB_41C0_5ECFC0F03DE9"
  },
  {
   "yaw": 79.8,
   "backwardYaw": -91.32,
   "distance": 1,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_266A4FDB_2C3C_447D_41C1_296818159F21"
  }
 ],
 "thumbnailUrl": "media/panorama_266ACC21_2C3C_CBCD_41B6_407672D395B3_t.jpg",
 "hfov": 360,
 "partial": false,
 "id": "panorama_266ACC21_2C3C_CBCD_41B6_407672D395B3",
 "label": "IMG_20220316_104743_00_330",
 "pitch": 0,
 "hfovMax": 130,
 "class": "Panorama",
 "vfov": 180,
 "frames": [
  {
   "front": {
    "levels": [
     {
      "url": "media/panorama_266ACC21_2C3C_CBCD_41B6_407672D395B3_0/f/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "width": 2048,
      "colCount": 4,
      "height": 2048,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_266ACC21_2C3C_CBCD_41B6_407672D395B3_0/f/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2,
      "height": 1024,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_266ACC21_2C3C_CBCD_41B6_407672D395B3_0/f/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ]
     }
    ],
    "class": "ImageResource"
   },
   "top": {
    "levels": [
     {
      "url": "media/panorama_266ACC21_2C3C_CBCD_41B6_407672D395B3_0/u/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "width": 2048,
      "colCount": 4,
      "height": 2048,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_266ACC21_2C3C_CBCD_41B6_407672D395B3_0/u/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2,
      "height": 1024,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_266ACC21_2C3C_CBCD_41B6_407672D395B3_0/u/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ]
     }
    ],
    "class": "ImageResource"
   },
   "right": {
    "levels": [
     {
      "url": "media/panorama_266ACC21_2C3C_CBCD_41B6_407672D395B3_0/r/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "width": 2048,
      "colCount": 4,
      "height": 2048,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_266ACC21_2C3C_CBCD_41B6_407672D395B3_0/r/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2,
      "height": 1024,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_266ACC21_2C3C_CBCD_41B6_407672D395B3_0/r/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ]
     }
    ],
    "class": "ImageResource"
   },
   "back": {
    "levels": [
     {
      "url": "media/panorama_266ACC21_2C3C_CBCD_41B6_407672D395B3_0/b/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "width": 2048,
      "colCount": 4,
      "height": 2048,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_266ACC21_2C3C_CBCD_41B6_407672D395B3_0/b/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2,
      "height": 1024,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_266ACC21_2C3C_CBCD_41B6_407672D395B3_0/b/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ]
     }
    ],
    "class": "ImageResource"
   },
   "bottom": {
    "levels": [
     {
      "url": "media/panorama_266ACC21_2C3C_CBCD_41B6_407672D395B3_0/d/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "width": 2048,
      "colCount": 4,
      "height": 2048,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_266ACC21_2C3C_CBCD_41B6_407672D395B3_0/d/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2,
      "height": 1024,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_266ACC21_2C3C_CBCD_41B6_407672D395B3_0/d/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ]
     }
    ],
    "class": "ImageResource"
   },
   "left": {
    "levels": [
     {
      "url": "media/panorama_266ACC21_2C3C_CBCD_41B6_407672D395B3_0/l/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "width": 2048,
      "colCount": 4,
      "height": 2048,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_266ACC21_2C3C_CBCD_41B6_407672D395B3_0/l/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2,
      "height": 1024,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_266ACC21_2C3C_CBCD_41B6_407672D395B3_0/l/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ]
     }
    ],
    "class": "ImageResource"
   },
   "class": "CubicPanoramaFrame",
   "thumbnailUrl": "media/panorama_266ACC21_2C3C_CBCD_41B6_407672D395B3_t.jpg"
  }
 ],
 "hfovMin": "135%",
 "overlays": [
  "this.panorama_266ACC21_2C3C_CBCD_41B6_407672D395B3_tcap0",
  "this.overlay_BA29C9F9_AF07_6F1F_41E5_B9368C5B7A70",
  "this.overlay_B91C0999_AF07_6F1E_41CF_17B60A7549EE",
  "this.overlay_BAC0578F_AF06_E3F1_41DA_050391A74A36",
  "this.overlay_BAE959F9_AF79_EF1E_41D9_C07EEA0EE2DC"
 ]
},
{
 "adjacentPanoramas": [
  {
   "yaw": -121.47,
   "backwardYaw": -78.63,
   "distance": 1,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_26660E76_2C3C_C437_41C0_4932F3D787B3"
  }
 ],
 "thumbnailUrl": "media/panorama_2640B699_2C3C_C4FC_4199_0A1F70F8E313_t.jpg",
 "hfov": 360,
 "partial": false,
 "id": "panorama_2640B699_2C3C_C4FC_4199_0A1F70F8E313",
 "label": "IMG_20220316_113905_00_370",
 "pitch": 0,
 "hfovMax": 130,
 "class": "Panorama",
 "vfov": 180,
 "frames": [
  {
   "front": {
    "levels": [
     {
      "url": "media/panorama_2640B699_2C3C_C4FC_4199_0A1F70F8E313_0/f/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "width": 2048,
      "colCount": 4,
      "height": 2048,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_2640B699_2C3C_C4FC_4199_0A1F70F8E313_0/f/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2,
      "height": 1024,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_2640B699_2C3C_C4FC_4199_0A1F70F8E313_0/f/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ]
     }
    ],
    "class": "ImageResource"
   },
   "top": {
    "levels": [
     {
      "url": "media/panorama_2640B699_2C3C_C4FC_4199_0A1F70F8E313_0/u/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "width": 2048,
      "colCount": 4,
      "height": 2048,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_2640B699_2C3C_C4FC_4199_0A1F70F8E313_0/u/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2,
      "height": 1024,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_2640B699_2C3C_C4FC_4199_0A1F70F8E313_0/u/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ]
     }
    ],
    "class": "ImageResource"
   },
   "right": {
    "levels": [
     {
      "url": "media/panorama_2640B699_2C3C_C4FC_4199_0A1F70F8E313_0/r/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "width": 2048,
      "colCount": 4,
      "height": 2048,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_2640B699_2C3C_C4FC_4199_0A1F70F8E313_0/r/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2,
      "height": 1024,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_2640B699_2C3C_C4FC_4199_0A1F70F8E313_0/r/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ]
     }
    ],
    "class": "ImageResource"
   },
   "back": {
    "levels": [
     {
      "url": "media/panorama_2640B699_2C3C_C4FC_4199_0A1F70F8E313_0/b/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "width": 2048,
      "colCount": 4,
      "height": 2048,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_2640B699_2C3C_C4FC_4199_0A1F70F8E313_0/b/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2,
      "height": 1024,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_2640B699_2C3C_C4FC_4199_0A1F70F8E313_0/b/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ]
     }
    ],
    "class": "ImageResource"
   },
   "bottom": {
    "levels": [
     {
      "url": "media/panorama_2640B699_2C3C_C4FC_4199_0A1F70F8E313_0/d/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "width": 2048,
      "colCount": 4,
      "height": 2048,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_2640B699_2C3C_C4FC_4199_0A1F70F8E313_0/d/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2,
      "height": 1024,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_2640B699_2C3C_C4FC_4199_0A1F70F8E313_0/d/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ]
     }
    ],
    "class": "ImageResource"
   },
   "left": {
    "levels": [
     {
      "url": "media/panorama_2640B699_2C3C_C4FC_4199_0A1F70F8E313_0/l/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "width": 2048,
      "colCount": 4,
      "height": 2048,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_2640B699_2C3C_C4FC_4199_0A1F70F8E313_0/l/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2,
      "height": 1024,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_2640B699_2C3C_C4FC_4199_0A1F70F8E313_0/l/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ]
     }
    ],
    "class": "ImageResource"
   },
   "class": "CubicPanoramaFrame",
   "thumbnailUrl": "media/panorama_2640B699_2C3C_C4FC_4199_0A1F70F8E313_t.jpg"
  }
 ],
 "hfovMin": "135%",
 "overlays": [
  "this.overlay_7BB38962_6064_90AE_419F_298A326F6706",
  "this.overlay_7C53B65E_6065_B097_41D3_146084FA2442",
  "this.panorama_2640B699_2C3C_C4FC_4199_0A1F70F8E313_tcap0"
 ]
},
{
 "adjacentPanoramas": [
  {
   "yaw": 98.73,
   "backwardYaw": -74.81,
   "distance": 1,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_2666F540_2C3C_C44C_41C0_1FA76F1EECB2"
  },
  {
   "yaw": -78.63,
   "backwardYaw": -121.47,
   "distance": 1,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_2640B699_2C3C_C4FC_4199_0A1F70F8E313"
  }
 ],
 "thumbnailUrl": "media/panorama_26660E76_2C3C_C437_41C0_4932F3D787B3_t.jpg",
 "hfov": 360,
 "partial": false,
 "id": "panorama_26660E76_2C3C_C437_41C0_4932F3D787B3",
 "label": "IMG_20220316_113742_00_369",
 "pitch": 0,
 "hfovMax": 130,
 "class": "Panorama",
 "vfov": 180,
 "frames": [
  {
   "front": {
    "levels": [
     {
      "url": "media/panorama_26660E76_2C3C_C437_41C0_4932F3D787B3_0/f/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "width": 2048,
      "colCount": 4,
      "height": 2048,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_26660E76_2C3C_C437_41C0_4932F3D787B3_0/f/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2,
      "height": 1024,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_26660E76_2C3C_C437_41C0_4932F3D787B3_0/f/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ]
     }
    ],
    "class": "ImageResource"
   },
   "top": {
    "levels": [
     {
      "url": "media/panorama_26660E76_2C3C_C437_41C0_4932F3D787B3_0/u/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "width": 2048,
      "colCount": 4,
      "height": 2048,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_26660E76_2C3C_C437_41C0_4932F3D787B3_0/u/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2,
      "height": 1024,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_26660E76_2C3C_C437_41C0_4932F3D787B3_0/u/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ]
     }
    ],
    "class": "ImageResource"
   },
   "right": {
    "levels": [
     {
      "url": "media/panorama_26660E76_2C3C_C437_41C0_4932F3D787B3_0/r/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "width": 2048,
      "colCount": 4,
      "height": 2048,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_26660E76_2C3C_C437_41C0_4932F3D787B3_0/r/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2,
      "height": 1024,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_26660E76_2C3C_C437_41C0_4932F3D787B3_0/r/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ]
     }
    ],
    "class": "ImageResource"
   },
   "back": {
    "levels": [
     {
      "url": "media/panorama_26660E76_2C3C_C437_41C0_4932F3D787B3_0/b/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "width": 2048,
      "colCount": 4,
      "height": 2048,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_26660E76_2C3C_C437_41C0_4932F3D787B3_0/b/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2,
      "height": 1024,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_26660E76_2C3C_C437_41C0_4932F3D787B3_0/b/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ]
     }
    ],
    "class": "ImageResource"
   },
   "bottom": {
    "levels": [
     {
      "url": "media/panorama_26660E76_2C3C_C437_41C0_4932F3D787B3_0/d/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "width": 2048,
      "colCount": 4,
      "height": 2048,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_26660E76_2C3C_C437_41C0_4932F3D787B3_0/d/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2,
      "height": 1024,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_26660E76_2C3C_C437_41C0_4932F3D787B3_0/d/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ]
     }
    ],
    "class": "ImageResource"
   },
   "left": {
    "levels": [
     {
      "url": "media/panorama_26660E76_2C3C_C437_41C0_4932F3D787B3_0/l/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "width": 2048,
      "colCount": 4,
      "height": 2048,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_26660E76_2C3C_C437_41C0_4932F3D787B3_0/l/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2,
      "height": 1024,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_26660E76_2C3C_C437_41C0_4932F3D787B3_0/l/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ]
     }
    ],
    "class": "ImageResource"
   },
   "class": "CubicPanoramaFrame",
   "thumbnailUrl": "media/panorama_26660E76_2C3C_C437_41C0_4932F3D787B3_t.jpg"
  }
 ],
 "hfovMin": "135%",
 "overlays": [
  "this.overlay_7A15144A_606C_90FE_41D4_8FE13E1CB1CA",
  "this.overlay_7BADA48C_606D_907A_41C2_A0C87549D740",
  "this.overlay_7B894CA2_606D_91AE_41D4_B150B2C1F646",
  "this.overlay_7B900F01_606C_906A_41CF_B2AFAE8E193B",
  "this.panorama_26660E76_2C3C_C437_41C0_4932F3D787B3_tcap0"
 ]
},
{
 "adjacentPanoramas": [
  {
   "yaw": -27.87,
   "backwardYaw": -143.2,
   "distance": 1,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_2669B134_2C3F_DDCB_41BB_88BE90D98D45"
  },
  {
   "yaw": 104.63,
   "backwardYaw": 131.53,
   "distance": 1,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_2669CEC5_2C3F_C455_41C1_4FFEA2873441"
  }
 ],
 "thumbnailUrl": "media/panorama_266659AF_2C3C_4CD5_41A2_2211D54F0994_t.jpg",
 "hfov": 360,
 "partial": false,
 "id": "panorama_266659AF_2C3C_4CD5_41A2_2211D54F0994",
 "label": "IMG_20220316_112036_00_358",
 "pitch": 0,
 "hfovMax": 130,
 "class": "Panorama",
 "vfov": 180,
 "frames": [
  {
   "front": {
    "levels": [
     {
      "url": "media/panorama_266659AF_2C3C_4CD5_41A2_2211D54F0994_0/f/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "width": 2048,
      "colCount": 4,
      "height": 2048,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_266659AF_2C3C_4CD5_41A2_2211D54F0994_0/f/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2,
      "height": 1024,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_266659AF_2C3C_4CD5_41A2_2211D54F0994_0/f/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ]
     }
    ],
    "class": "ImageResource"
   },
   "top": {
    "levels": [
     {
      "url": "media/panorama_266659AF_2C3C_4CD5_41A2_2211D54F0994_0/u/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "width": 2048,
      "colCount": 4,
      "height": 2048,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_266659AF_2C3C_4CD5_41A2_2211D54F0994_0/u/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2,
      "height": 1024,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_266659AF_2C3C_4CD5_41A2_2211D54F0994_0/u/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ]
     }
    ],
    "class": "ImageResource"
   },
   "right": {
    "levels": [
     {
      "url": "media/panorama_266659AF_2C3C_4CD5_41A2_2211D54F0994_0/r/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "width": 2048,
      "colCount": 4,
      "height": 2048,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_266659AF_2C3C_4CD5_41A2_2211D54F0994_0/r/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2,
      "height": 1024,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_266659AF_2C3C_4CD5_41A2_2211D54F0994_0/r/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ]
     }
    ],
    "class": "ImageResource"
   },
   "back": {
    "levels": [
     {
      "url": "media/panorama_266659AF_2C3C_4CD5_41A2_2211D54F0994_0/b/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "width": 2048,
      "colCount": 4,
      "height": 2048,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_266659AF_2C3C_4CD5_41A2_2211D54F0994_0/b/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2,
      "height": 1024,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_266659AF_2C3C_4CD5_41A2_2211D54F0994_0/b/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ]
     }
    ],
    "class": "ImageResource"
   },
   "bottom": {
    "levels": [
     {
      "url": "media/panorama_266659AF_2C3C_4CD5_41A2_2211D54F0994_0/d/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "width": 2048,
      "colCount": 4,
      "height": 2048,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_266659AF_2C3C_4CD5_41A2_2211D54F0994_0/d/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2,
      "height": 1024,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_266659AF_2C3C_4CD5_41A2_2211D54F0994_0/d/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ]
     }
    ],
    "class": "ImageResource"
   },
   "left": {
    "levels": [
     {
      "url": "media/panorama_266659AF_2C3C_4CD5_41A2_2211D54F0994_0/l/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "width": 2048,
      "colCount": 4,
      "height": 2048,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_266659AF_2C3C_4CD5_41A2_2211D54F0994_0/l/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2,
      "height": 1024,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_266659AF_2C3C_4CD5_41A2_2211D54F0994_0/l/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ]
     }
    ],
    "class": "ImageResource"
   },
   "class": "CubicPanoramaFrame",
   "thumbnailUrl": "media/panorama_266659AF_2C3C_4CD5_41A2_2211D54F0994_t.jpg"
  }
 ],
 "hfovMin": "135%",
 "overlays": [
  "this.overlay_77036939_605F_909D_41C4_E4402E0E9C31",
  "this.overlay_781F6465_605C_90AA_4151_520C5B999650",
  "this.panorama_266659AF_2C3C_4CD5_41A2_2211D54F0994_tcap0",
  "this.overlay_8BE11369_AF0B_633E_41DD_1120E7681060",
  "this.overlay_8BBC6562_AF0B_6732_41E3_634E0A701007"
 ]
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": 102.37,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ]
 },
 "id": "camera_86814E8B_AF0B_65F3_41B4_BC5AAC3F8D82"
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": -176.11,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ]
 },
 "id": "camera_87B26D58_AF0B_671E_41D8_2939C936F3A1"
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": -39.57,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ]
 },
 "id": "camera_871E5E11_AF0B_64EE_41E0_B1B1F7AEC214"
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": -93.33,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ]
 },
 "id": "camera_876CBD8C_AF0B_67F6_41DE_735E4F58AD6A"
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": 147.59,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ]
 },
 "id": "camera_88338C75_AF0B_6516_41B5_C916C38ABABF"
},
{
 "adjacentPanoramas": [
  {
   "yaw": -68.84,
   "backwardYaw": 17.24,
   "distance": 1,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_2669D8F8_2C3F_CC3B_41C4_43F82B11C465"
  }
 ],
 "thumbnailUrl": "media/panorama_2669E37C_2C3F_DC3B_41AF_EA365FC497F6_t.jpg",
 "hfov": 360,
 "partial": false,
 "id": "panorama_2669E37C_2C3F_DC3B_41AF_EA365FC497F6",
 "label": "IMG_20220316_111120_00_354",
 "pitch": 0,
 "hfovMax": 130,
 "class": "Panorama",
 "vfov": 180,
 "frames": [
  {
   "front": {
    "levels": [
     {
      "url": "media/panorama_2669E37C_2C3F_DC3B_41AF_EA365FC497F6_0/f/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "width": 2048,
      "colCount": 4,
      "height": 2048,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_2669E37C_2C3F_DC3B_41AF_EA365FC497F6_0/f/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2,
      "height": 1024,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_2669E37C_2C3F_DC3B_41AF_EA365FC497F6_0/f/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ]
     }
    ],
    "class": "ImageResource"
   },
   "top": {
    "levels": [
     {
      "url": "media/panorama_2669E37C_2C3F_DC3B_41AF_EA365FC497F6_0/u/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "width": 2048,
      "colCount": 4,
      "height": 2048,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_2669E37C_2C3F_DC3B_41AF_EA365FC497F6_0/u/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2,
      "height": 1024,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_2669E37C_2C3F_DC3B_41AF_EA365FC497F6_0/u/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ]
     }
    ],
    "class": "ImageResource"
   },
   "right": {
    "levels": [
     {
      "url": "media/panorama_2669E37C_2C3F_DC3B_41AF_EA365FC497F6_0/r/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "width": 2048,
      "colCount": 4,
      "height": 2048,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_2669E37C_2C3F_DC3B_41AF_EA365FC497F6_0/r/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2,
      "height": 1024,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_2669E37C_2C3F_DC3B_41AF_EA365FC497F6_0/r/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ]
     }
    ],
    "class": "ImageResource"
   },
   "back": {
    "levels": [
     {
      "url": "media/panorama_2669E37C_2C3F_DC3B_41AF_EA365FC497F6_0/b/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "width": 2048,
      "colCount": 4,
      "height": 2048,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_2669E37C_2C3F_DC3B_41AF_EA365FC497F6_0/b/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2,
      "height": 1024,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_2669E37C_2C3F_DC3B_41AF_EA365FC497F6_0/b/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ]
     }
    ],
    "class": "ImageResource"
   },
   "bottom": {
    "levels": [
     {
      "url": "media/panorama_2669E37C_2C3F_DC3B_41AF_EA365FC497F6_0/d/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "width": 2048,
      "colCount": 4,
      "height": 2048,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_2669E37C_2C3F_DC3B_41AF_EA365FC497F6_0/d/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2,
      "height": 1024,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_2669E37C_2C3F_DC3B_41AF_EA365FC497F6_0/d/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ]
     }
    ],
    "class": "ImageResource"
   },
   "left": {
    "levels": [
     {
      "url": "media/panorama_2669E37C_2C3F_DC3B_41AF_EA365FC497F6_0/l/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "width": 2048,
      "colCount": 4,
      "height": 2048,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_2669E37C_2C3F_DC3B_41AF_EA365FC497F6_0/l/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2,
      "height": 1024,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_2669E37C_2C3F_DC3B_41AF_EA365FC497F6_0/l/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ]
     }
    ],
    "class": "ImageResource"
   },
   "class": "CubicPanoramaFrame",
   "thumbnailUrl": "media/panorama_2669E37C_2C3F_DC3B_41AF_EA365FC497F6_t.jpg"
  }
 ],
 "hfovMin": "135%",
 "overlays": [
  "this.overlay_78CEBFDB_6064_8F9E_41D6_FAAA8E5BA31B",
  "this.overlay_7919490E_6065_9076_41D7_AC3D769D54F6",
  "this.panorama_2669E37C_2C3F_DC3B_41AF_EA365FC497F6_tcap0"
 ]
},
{
 "adjacentPanoramas": [
  {
   "yaw": -57.28,
   "backwardYaw": 12.18,
   "distance": 1,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_2669B134_2C3F_DDCB_41BB_88BE90D98D45"
  },
  {
   "yaw": -133.15,
   "backwardYaw": 88.05,
   "distance": 1,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_266A7DB6_2C3C_4437_41C1_235AEE268532"
  }
 ],
 "thumbnailUrl": "media/panorama_2669A39A_2C3C_5CFF_41C0_F596914DA092_t.jpg",
 "hfov": 360,
 "partial": false,
 "id": "panorama_2669A39A_2C3C_5CFF_41C0_F596914DA092",
 "label": "IMG_20220316_112336_00_359",
 "pitch": 0,
 "hfovMax": 130,
 "class": "Panorama",
 "vfov": 180,
 "frames": [
  {
   "front": {
    "levels": [
     {
      "url": "media/panorama_2669A39A_2C3C_5CFF_41C0_F596914DA092_0/f/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "width": 2048,
      "colCount": 4,
      "height": 2048,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_2669A39A_2C3C_5CFF_41C0_F596914DA092_0/f/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2,
      "height": 1024,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_2669A39A_2C3C_5CFF_41C0_F596914DA092_0/f/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ]
     }
    ],
    "class": "ImageResource"
   },
   "top": {
    "levels": [
     {
      "url": "media/panorama_2669A39A_2C3C_5CFF_41C0_F596914DA092_0/u/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "width": 2048,
      "colCount": 4,
      "height": 2048,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_2669A39A_2C3C_5CFF_41C0_F596914DA092_0/u/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2,
      "height": 1024,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_2669A39A_2C3C_5CFF_41C0_F596914DA092_0/u/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ]
     }
    ],
    "class": "ImageResource"
   },
   "right": {
    "levels": [
     {
      "url": "media/panorama_2669A39A_2C3C_5CFF_41C0_F596914DA092_0/r/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "width": 2048,
      "colCount": 4,
      "height": 2048,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_2669A39A_2C3C_5CFF_41C0_F596914DA092_0/r/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2,
      "height": 1024,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_2669A39A_2C3C_5CFF_41C0_F596914DA092_0/r/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ]
     }
    ],
    "class": "ImageResource"
   },
   "back": {
    "levels": [
     {
      "url": "media/panorama_2669A39A_2C3C_5CFF_41C0_F596914DA092_0/b/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "width": 2048,
      "colCount": 4,
      "height": 2048,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_2669A39A_2C3C_5CFF_41C0_F596914DA092_0/b/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2,
      "height": 1024,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_2669A39A_2C3C_5CFF_41C0_F596914DA092_0/b/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ]
     }
    ],
    "class": "ImageResource"
   },
   "bottom": {
    "levels": [
     {
      "url": "media/panorama_2669A39A_2C3C_5CFF_41C0_F596914DA092_0/d/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "width": 2048,
      "colCount": 4,
      "height": 2048,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_2669A39A_2C3C_5CFF_41C0_F596914DA092_0/d/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2,
      "height": 1024,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_2669A39A_2C3C_5CFF_41C0_F596914DA092_0/d/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ]
     }
    ],
    "class": "ImageResource"
   },
   "left": {
    "levels": [
     {
      "url": "media/panorama_2669A39A_2C3C_5CFF_41C0_F596914DA092_0/l/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "width": 2048,
      "colCount": 4,
      "height": 2048,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_2669A39A_2C3C_5CFF_41C0_F596914DA092_0/l/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2,
      "height": 1024,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_2669A39A_2C3C_5CFF_41C0_F596914DA092_0/l/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ]
     }
    ],
    "class": "ImageResource"
   },
   "class": "CubicPanoramaFrame",
   "thumbnailUrl": "media/panorama_2669A39A_2C3C_5CFF_41C0_F596914DA092_t.jpg"
  }
 ],
 "hfovMin": "135%",
 "overlays": [
  "this.overlay_751DA289_602C_907A_41C5_FD4DEBEBF11D",
  "this.overlay_76482BB2_602D_97AE_4195_AC01F1CC1E6A",
  "this.overlay_76881EB0_6025_F1AA_41C7_1A3AAF535CCD",
  "this.overlay_764BDEC8_6024_91FB_41D6_7F4F4CCB1B72",
  "this.panorama_2669A39A_2C3C_5CFF_41C0_F596914DA092_tcap0"
 ]
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ]
 },
 "id": "camera_88375C83_AF0B_65F2_41D9_489C7F8073C4"
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": 102.37,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ]
 },
 "id": "camera_86B22E7C_AF0B_6516_41C9_168CCC9959B1"
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ]
 },
 "id": "panorama_2666CCAC_2C3C_C4D4_41B6_6F5BD1BACD46_camera"
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": 143.23,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ]
 },
 "id": "camera_88132CCC_AF0B_6575_41DF_F0D8551D31A8"
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ]
 },
 "id": "panorama_266ACC21_2C3C_CBCD_41B6_407672D395B3_camera"
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ]
 },
 "id": "panorama_2640B699_2C3C_C4FC_4199_0A1F70F8E313_camera"
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ]
 },
 "id": "panorama_26660E76_2C3C_C437_41C0_4932F3D787B3_camera"
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": 112.43,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ]
 },
 "id": "camera_87B96D4D_AF0B_6771_41E2_77D65187F622"
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": -167.82,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ]
 },
 "id": "camera_85D3BF4C_AF0B_6376_41DF_9B2B0BF7DF16"
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": 63.94,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ]
 },
 "id": "camera_8673EEC9_AF0B_657E_41D8_7DDA86E6E089"
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ]
 },
 "id": "panorama_26664293_2C3C_5CCD_41B6_BA5F5C9DBD4C_camera"
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ]
 },
 "id": "panorama_26666712_2C3C_C5CF_4198_822E2A8C8DCC_camera"
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": -42.71,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ]
 },
 "id": "camera_86B99E6C_AF0B_6536_41D4_8556A4B4EC61"
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": 122.72,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ]
 },
 "id": "camera_86675EBE_AF0B_6512_419D_F1DFD3563FEF"
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ]
 },
 "id": "panorama_266A5CEF_2C3C_4455_41A5_2CBA724838F2_camera"
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": 158.02,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ]
 },
 "id": "camera_87F6ED0F_AF0B_64F2_41E2_CA3B480ACE1A"
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": -34.54,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ]
 },
 "id": "camera_85A09BBC_AF0B_6316_41D6_C153F6BFAB44"
},
{
 "adjacentPanoramas": [
  {
   "yaw": 17.24,
   "backwardYaw": -68.84,
   "distance": 1,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_2669E37C_2C3F_DC3B_41AF_EA365FC497F6"
  }
 ],
 "thumbnailUrl": "media/panorama_2669D8F8_2C3F_CC3B_41C4_43F82B11C465_t.jpg",
 "hfov": 360,
 "partial": false,
 "id": "panorama_2669D8F8_2C3F_CC3B_41C4_43F82B11C465",
 "label": "IMG_20220316_110942_00_352",
 "pitch": 0,
 "hfovMax": 130,
 "class": "Panorama",
 "vfov": 180,
 "frames": [
  {
   "front": {
    "levels": [
     {
      "url": "media/panorama_2669D8F8_2C3F_CC3B_41C4_43F82B11C465_0/f/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "width": 2048,
      "colCount": 4,
      "height": 2048,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_2669D8F8_2C3F_CC3B_41C4_43F82B11C465_0/f/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2,
      "height": 1024,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_2669D8F8_2C3F_CC3B_41C4_43F82B11C465_0/f/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ]
     }
    ],
    "class": "ImageResource"
   },
   "top": {
    "levels": [
     {
      "url": "media/panorama_2669D8F8_2C3F_CC3B_41C4_43F82B11C465_0/u/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "width": 2048,
      "colCount": 4,
      "height": 2048,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_2669D8F8_2C3F_CC3B_41C4_43F82B11C465_0/u/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2,
      "height": 1024,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_2669D8F8_2C3F_CC3B_41C4_43F82B11C465_0/u/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ]
     }
    ],
    "class": "ImageResource"
   },
   "right": {
    "levels": [
     {
      "url": "media/panorama_2669D8F8_2C3F_CC3B_41C4_43F82B11C465_0/r/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "width": 2048,
      "colCount": 4,
      "height": 2048,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_2669D8F8_2C3F_CC3B_41C4_43F82B11C465_0/r/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2,
      "height": 1024,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_2669D8F8_2C3F_CC3B_41C4_43F82B11C465_0/r/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ]
     }
    ],
    "class": "ImageResource"
   },
   "back": {
    "levels": [
     {
      "url": "media/panorama_2669D8F8_2C3F_CC3B_41C4_43F82B11C465_0/b/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "width": 2048,
      "colCount": 4,
      "height": 2048,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_2669D8F8_2C3F_CC3B_41C4_43F82B11C465_0/b/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2,
      "height": 1024,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_2669D8F8_2C3F_CC3B_41C4_43F82B11C465_0/b/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ]
     }
    ],
    "class": "ImageResource"
   },
   "bottom": {
    "levels": [
     {
      "url": "media/panorama_2669D8F8_2C3F_CC3B_41C4_43F82B11C465_0/d/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "width": 2048,
      "colCount": 4,
      "height": 2048,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_2669D8F8_2C3F_CC3B_41C4_43F82B11C465_0/d/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2,
      "height": 1024,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_2669D8F8_2C3F_CC3B_41C4_43F82B11C465_0/d/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ]
     }
    ],
    "class": "ImageResource"
   },
   "left": {
    "levels": [
     {
      "url": "media/panorama_2669D8F8_2C3F_CC3B_41C4_43F82B11C465_0/l/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "width": 2048,
      "colCount": 4,
      "height": 2048,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_2669D8F8_2C3F_CC3B_41C4_43F82B11C465_0/l/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2,
      "height": 1024,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_2669D8F8_2C3F_CC3B_41C4_43F82B11C465_0/l/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ]
     }
    ],
    "class": "ImageResource"
   },
   "class": "CubicPanoramaFrame",
   "thumbnailUrl": "media/panorama_2669D8F8_2C3F_CC3B_41C4_43F82B11C465_t.jpg"
  }
 ],
 "hfovMin": "135%",
 "overlays": [
  "this.overlay_78EDA10A_606D_907E_41BF_752A623985C3",
  "this.overlay_78F1C850_606D_90EA_41B5_10CACDCF4C98",
  "this.overlay_79BCB011_606C_B06A_41C1_18081640B063",
  "this.overlay_791E77C8_6064_9FFA_41D4_2EDDF3A7438E",
  "this.panorama_2669D8F8_2C3F_CC3B_41C4_43F82B11C465_tcap0"
 ]
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ]
 },
 "id": "panorama_2669CA02_2C3F_CFCF_41C1_E694A5B56234_camera"
},
{
 "adjacentPanoramas": [
  {
   "yaw": -67.57,
   "backwardYaw": -21.47,
   "distance": 1,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_26667EAB_2C3C_44DC_41BD_508AF18BD0E5"
  },
  {
   "yaw": 125.99,
   "backwardYaw": -111.42,
   "distance": 1,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_2650731A_2C3C_7DFF_41BF_42020C9917DD"
  }
 ],
 "thumbnailUrl": "media/panorama_274E4A2E_2C3D_CFD7_41C3_E749466BFD9F_t.jpg",
 "hfov": 360,
 "partial": false,
 "id": "panorama_274E4A2E_2C3D_CFD7_41C3_E749466BFD9F",
 "label": "IMG_20220316_103708_00_324",
 "pitch": 0,
 "hfovMax": 130,
 "class": "Panorama",
 "vfov": 180,
 "frames": [
  {
   "front": {
    "levels": [
     {
      "url": "media/panorama_274E4A2E_2C3D_CFD7_41C3_E749466BFD9F_0/f/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "width": 2048,
      "colCount": 4,
      "height": 2048,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_274E4A2E_2C3D_CFD7_41C3_E749466BFD9F_0/f/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2,
      "height": 1024,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_274E4A2E_2C3D_CFD7_41C3_E749466BFD9F_0/f/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ]
     }
    ],
    "class": "ImageResource"
   },
   "top": {
    "levels": [
     {
      "url": "media/panorama_274E4A2E_2C3D_CFD7_41C3_E749466BFD9F_0/u/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "width": 2048,
      "colCount": 4,
      "height": 2048,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_274E4A2E_2C3D_CFD7_41C3_E749466BFD9F_0/u/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2,
      "height": 1024,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_274E4A2E_2C3D_CFD7_41C3_E749466BFD9F_0/u/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ]
     }
    ],
    "class": "ImageResource"
   },
   "right": {
    "levels": [
     {
      "url": "media/panorama_274E4A2E_2C3D_CFD7_41C3_E749466BFD9F_0/r/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "width": 2048,
      "colCount": 4,
      "height": 2048,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_274E4A2E_2C3D_CFD7_41C3_E749466BFD9F_0/r/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2,
      "height": 1024,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_274E4A2E_2C3D_CFD7_41C3_E749466BFD9F_0/r/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ]
     }
    ],
    "class": "ImageResource"
   },
   "back": {
    "levels": [
     {
      "url": "media/panorama_274E4A2E_2C3D_CFD7_41C3_E749466BFD9F_0/b/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "width": 2048,
      "colCount": 4,
      "height": 2048,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_274E4A2E_2C3D_CFD7_41C3_E749466BFD9F_0/b/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2,
      "height": 1024,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_274E4A2E_2C3D_CFD7_41C3_E749466BFD9F_0/b/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ]
     }
    ],
    "class": "ImageResource"
   },
   "bottom": {
    "levels": [
     {
      "url": "media/panorama_274E4A2E_2C3D_CFD7_41C3_E749466BFD9F_0/d/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "width": 2048,
      "colCount": 4,
      "height": 2048,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_274E4A2E_2C3D_CFD7_41C3_E749466BFD9F_0/d/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2,
      "height": 1024,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_274E4A2E_2C3D_CFD7_41C3_E749466BFD9F_0/d/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ]
     }
    ],
    "class": "ImageResource"
   },
   "left": {
    "levels": [
     {
      "url": "media/panorama_274E4A2E_2C3D_CFD7_41C3_E749466BFD9F_0/l/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "width": 2048,
      "colCount": 4,
      "height": 2048,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_274E4A2E_2C3D_CFD7_41C3_E749466BFD9F_0/l/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2,
      "height": 1024,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_274E4A2E_2C3D_CFD7_41C3_E749466BFD9F_0/l/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ]
     }
    ],
    "class": "ImageResource"
   },
   "class": "CubicPanoramaFrame",
   "thumbnailUrl": "media/panorama_274E4A2E_2C3D_CFD7_41C3_E749466BFD9F_t.jpg"
  }
 ],
 "hfovMin": "135%",
 "overlays": [
  "this.overlay_3E0875C4_2C43_C44B_41C2_794D0FDEEC33",
  "this.overlay_3932B5C7_2C44_4454_41B0_FCC94580F6FF",
  "this.overlay_3F798435_2C44_4435_41C3_DD91DEDF4EE7",
  "this.overlay_39BA6B47_2C45_CC55_4188_AFDD2A3C6DA0",
  "this.panorama_274E4A2E_2C3D_CFD7_41C3_E749466BFD9F_tcap0"
 ]
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": -116.06,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ]
 },
 "id": "camera_85B4BBD4_AF0B_6316_41C3_59AB861AFD38"
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": -55.17,
  "class": "PanoramaCameraPosition",
  "pitch": 5.68
 },
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ]
 },
 "id": "panorama_274E4A2E_2C3D_CFD7_41C3_E749466BFD9F_camera"
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": -40.32,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ]
 },
 "id": "camera_8603CF0A_AF0B_64F2_41D5_9303AC26882D"
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": -54.01,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ]
 },
 "id": "camera_861F7F14_AF0B_6316_41B6_70A429A6DE24"
},
{
 "adjacentPanoramas": [
  {
   "yaw": 75.12,
   "backwardYaw": -103.25,
   "distance": 1,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_266A7DB6_2C3C_4437_41C1_235AEE268532"
  },
  {
   "yaw": -101.87,
   "backwardYaw": -6.91,
   "distance": 1,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_266A40B1_2C3C_7CCD_41B2_B5FCEE869E17"
  }
 ],
 "thumbnailUrl": "media/panorama_26667DFA_2C3C_443C_41B2_332913C8F61A_t.jpg",
 "hfov": 360,
 "partial": false,
 "id": "panorama_26667DFA_2C3C_443C_41B2_332913C8F61A",
 "label": "IMG_20220316_112437_00_360",
 "pitch": 0,
 "hfovMax": 130,
 "class": "Panorama",
 "vfov": 180,
 "frames": [
  {
   "front": {
    "levels": [
     {
      "url": "media/panorama_26667DFA_2C3C_443C_41B2_332913C8F61A_0/f/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "width": 2048,
      "colCount": 4,
      "height": 2048,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_26667DFA_2C3C_443C_41B2_332913C8F61A_0/f/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2,
      "height": 1024,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_26667DFA_2C3C_443C_41B2_332913C8F61A_0/f/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ]
     }
    ],
    "class": "ImageResource"
   },
   "top": {
    "levels": [
     {
      "url": "media/panorama_26667DFA_2C3C_443C_41B2_332913C8F61A_0/u/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "width": 2048,
      "colCount": 4,
      "height": 2048,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_26667DFA_2C3C_443C_41B2_332913C8F61A_0/u/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2,
      "height": 1024,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_26667DFA_2C3C_443C_41B2_332913C8F61A_0/u/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ]
     }
    ],
    "class": "ImageResource"
   },
   "right": {
    "levels": [
     {
      "url": "media/panorama_26667DFA_2C3C_443C_41B2_332913C8F61A_0/r/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "width": 2048,
      "colCount": 4,
      "height": 2048,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_26667DFA_2C3C_443C_41B2_332913C8F61A_0/r/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2,
      "height": 1024,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_26667DFA_2C3C_443C_41B2_332913C8F61A_0/r/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ]
     }
    ],
    "class": "ImageResource"
   },
   "back": {
    "levels": [
     {
      "url": "media/panorama_26667DFA_2C3C_443C_41B2_332913C8F61A_0/b/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "width": 2048,
      "colCount": 4,
      "height": 2048,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_26667DFA_2C3C_443C_41B2_332913C8F61A_0/b/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2,
      "height": 1024,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_26667DFA_2C3C_443C_41B2_332913C8F61A_0/b/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ]
     }
    ],
    "class": "ImageResource"
   },
   "bottom": {
    "levels": [
     {
      "url": "media/panorama_26667DFA_2C3C_443C_41B2_332913C8F61A_0/d/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "width": 2048,
      "colCount": 4,
      "height": 2048,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_26667DFA_2C3C_443C_41B2_332913C8F61A_0/d/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2,
      "height": 1024,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_26667DFA_2C3C_443C_41B2_332913C8F61A_0/d/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ]
     }
    ],
    "class": "ImageResource"
   },
   "left": {
    "levels": [
     {
      "url": "media/panorama_26667DFA_2C3C_443C_41B2_332913C8F61A_0/l/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "width": 2048,
      "colCount": 4,
      "height": 2048,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_26667DFA_2C3C_443C_41B2_332913C8F61A_0/l/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2,
      "height": 1024,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_26667DFA_2C3C_443C_41B2_332913C8F61A_0/l/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ]
     }
    ],
    "class": "ImageResource"
   },
   "class": "CubicPanoramaFrame",
   "thumbnailUrl": "media/panorama_26667DFA_2C3C_443C_41B2_332913C8F61A_t.jpg"
  }
 ],
 "hfovMin": "135%",
 "overlays": [
  "this.overlay_4DCA1EFF_5549_D849_41CC_26B7C1A84FD1",
  "this.overlay_4C44EDE3_5546_D87A_41CB_C6217DEF6FAC",
  "this.overlay_4D22CC7B_5547_B849_41A3_5584CD2C4147",
  "this.overlay_4C3D5B30_5546_D9D7_41D3_74CFB915F7E3",
  "this.panorama_26667DFA_2C3C_443C_41B2_332913C8F61A_tcap0"
 ]
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": -71.1,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ]
 },
 "id": "camera_87AFBD42_AF0B_6772_41D9_6DA8E877F8BF"
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": -77.25,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ]
 },
 "id": "camera_85983BE9_AF0B_633E_41E4_7FD328CA4A11"
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": 76.75,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ]
 },
 "id": "camera_86DE1E57_AF0B_6513_41DA_4E19240CAD5D"
},
{
 "adjacentPanoramas": [
  {
   "yaw": -21.98,
   "backwardYaw": 137.29,
   "distance": 1,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_266A48C5_2C3C_4C55_41B3_1D70C2050903"
  },
  {
   "yaw": 155.13,
   "backwardYaw": -77.63,
   "distance": 1,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_266A5CEF_2C3C_4455_41A5_2CBA724838F2"
  },
  {
   "yaw": -145.71,
   "backwardYaw": -77.63,
   "distance": 1,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_266A5CEF_2C3C_4455_41A5_2CBA724838F2"
  }
 ],
 "thumbnailUrl": "media/panorama_266A2362_2C3C_7C4F_41C5_86D5259F47A8_t.jpg",
 "hfov": 360,
 "partial": false,
 "id": "panorama_266A2362_2C3C_7C4F_41C5_86D5259F47A8",
 "label": "IMG_20220316_104029_00_327",
 "pitch": 0,
 "hfovMax": 130,
 "class": "Panorama",
 "vfov": 180,
 "frames": [
  {
   "front": {
    "levels": [
     {
      "url": "media/panorama_266A2362_2C3C_7C4F_41C5_86D5259F47A8_0/f/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "width": 2048,
      "colCount": 4,
      "height": 2048,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_266A2362_2C3C_7C4F_41C5_86D5259F47A8_0/f/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2,
      "height": 1024,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_266A2362_2C3C_7C4F_41C5_86D5259F47A8_0/f/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ]
     }
    ],
    "class": "ImageResource"
   },
   "top": {
    "levels": [
     {
      "url": "media/panorama_266A2362_2C3C_7C4F_41C5_86D5259F47A8_0/u/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "width": 2048,
      "colCount": 4,
      "height": 2048,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_266A2362_2C3C_7C4F_41C5_86D5259F47A8_0/u/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2,
      "height": 1024,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_266A2362_2C3C_7C4F_41C5_86D5259F47A8_0/u/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ]
     }
    ],
    "class": "ImageResource"
   },
   "right": {
    "levels": [
     {
      "url": "media/panorama_266A2362_2C3C_7C4F_41C5_86D5259F47A8_0/r/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "width": 2048,
      "colCount": 4,
      "height": 2048,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_266A2362_2C3C_7C4F_41C5_86D5259F47A8_0/r/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2,
      "height": 1024,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_266A2362_2C3C_7C4F_41C5_86D5259F47A8_0/r/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ]
     }
    ],
    "class": "ImageResource"
   },
   "back": {
    "levels": [
     {
      "url": "media/panorama_266A2362_2C3C_7C4F_41C5_86D5259F47A8_0/b/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "width": 2048,
      "colCount": 4,
      "height": 2048,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_266A2362_2C3C_7C4F_41C5_86D5259F47A8_0/b/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2,
      "height": 1024,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_266A2362_2C3C_7C4F_41C5_86D5259F47A8_0/b/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ]
     }
    ],
    "class": "ImageResource"
   },
   "bottom": {
    "levels": [
     {
      "url": "media/panorama_266A2362_2C3C_7C4F_41C5_86D5259F47A8_0/d/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "width": 2048,
      "colCount": 4,
      "height": 2048,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_266A2362_2C3C_7C4F_41C5_86D5259F47A8_0/d/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2,
      "height": 1024,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_266A2362_2C3C_7C4F_41C5_86D5259F47A8_0/d/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ]
     }
    ],
    "class": "ImageResource"
   },
   "left": {
    "levels": [
     {
      "url": "media/panorama_266A2362_2C3C_7C4F_41C5_86D5259F47A8_0/l/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "width": 2048,
      "colCount": 4,
      "height": 2048,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_266A2362_2C3C_7C4F_41C5_86D5259F47A8_0/l/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2,
      "height": 1024,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_266A2362_2C3C_7C4F_41C5_86D5259F47A8_0/l/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ]
     }
    ],
    "class": "ImageResource"
   },
   "class": "CubicPanoramaFrame",
   "thumbnailUrl": "media/panorama_266A2362_2C3C_7C4F_41C5_86D5259F47A8_t.jpg"
  }
 ],
 "hfovMin": "135%",
 "overlays": [
  "this.overlay_38800F19_2CCC_C5FC_41C3_67E75560E2EC",
  "this.overlay_3A88EB65_2CCF_CC55_41C2_03ED039CC10A",
  "this.overlay_380CC19B_2CCC_BCFD_41C4_37D566F4FF6A",
  "this.overlay_3818ED43_2CCC_C44D_4196_03713BF83FE8",
  "this.overlay_3AECAB15_2CC4_4DF4_41B4_E7501CA5942B",
  "this.overlay_3AACD6A5_2CDC_C4D4_4191_D057DA4A6E6D",
  "this.panorama_266A2362_2C3C_7C4F_41C5_86D5259F47A8_tcap0"
 ]
},
{
 "adjacentPanoramas": [
  {
   "yaw": 12.18,
   "backwardYaw": -57.28,
   "distance": 1,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_2669A39A_2C3C_5CFF_41C0_F596914DA092"
  },
  {
   "yaw": 108.9,
   "backwardYaw": -116.06,
   "distance": 1,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_2669CA02_2C3F_CFCF_41C1_E694A5B56234"
  },
  {
   "yaw": -143.2,
   "backwardYaw": -27.87,
   "distance": 1,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_266659AF_2C3C_4CD5_41A2_2211D54F0994"
  }
 ],
 "thumbnailUrl": "media/panorama_2669B134_2C3F_DDCB_41BB_88BE90D98D45_t.jpg",
 "hfov": 360,
 "partial": false,
 "id": "panorama_2669B134_2C3F_DDCB_41BB_88BE90D98D45",
 "label": "IMG_20220316_110644_00_348",
 "pitch": 0,
 "hfovMax": 130,
 "class": "Panorama",
 "vfov": 180,
 "frames": [
  {
   "front": {
    "levels": [
     {
      "url": "media/panorama_2669B134_2C3F_DDCB_41BB_88BE90D98D45_0/f/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "width": 2048,
      "colCount": 4,
      "height": 2048,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_2669B134_2C3F_DDCB_41BB_88BE90D98D45_0/f/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2,
      "height": 1024,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_2669B134_2C3F_DDCB_41BB_88BE90D98D45_0/f/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ]
     }
    ],
    "class": "ImageResource"
   },
   "top": {
    "levels": [
     {
      "url": "media/panorama_2669B134_2C3F_DDCB_41BB_88BE90D98D45_0/u/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "width": 2048,
      "colCount": 4,
      "height": 2048,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_2669B134_2C3F_DDCB_41BB_88BE90D98D45_0/u/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2,
      "height": 1024,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_2669B134_2C3F_DDCB_41BB_88BE90D98D45_0/u/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ]
     }
    ],
    "class": "ImageResource"
   },
   "right": {
    "levels": [
     {
      "url": "media/panorama_2669B134_2C3F_DDCB_41BB_88BE90D98D45_0/r/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "width": 2048,
      "colCount": 4,
      "height": 2048,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_2669B134_2C3F_DDCB_41BB_88BE90D98D45_0/r/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2,
      "height": 1024,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_2669B134_2C3F_DDCB_41BB_88BE90D98D45_0/r/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ]
     }
    ],
    "class": "ImageResource"
   },
   "back": {
    "levels": [
     {
      "url": "media/panorama_2669B134_2C3F_DDCB_41BB_88BE90D98D45_0/b/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "width": 2048,
      "colCount": 4,
      "height": 2048,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_2669B134_2C3F_DDCB_41BB_88BE90D98D45_0/b/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2,
      "height": 1024,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_2669B134_2C3F_DDCB_41BB_88BE90D98D45_0/b/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ]
     }
    ],
    "class": "ImageResource"
   },
   "bottom": {
    "levels": [
     {
      "url": "media/panorama_2669B134_2C3F_DDCB_41BB_88BE90D98D45_0/d/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "width": 2048,
      "colCount": 4,
      "height": 2048,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_2669B134_2C3F_DDCB_41BB_88BE90D98D45_0/d/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2,
      "height": 1024,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_2669B134_2C3F_DDCB_41BB_88BE90D98D45_0/d/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ]
     }
    ],
    "class": "ImageResource"
   },
   "left": {
    "levels": [
     {
      "url": "media/panorama_2669B134_2C3F_DDCB_41BB_88BE90D98D45_0/l/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "width": 2048,
      "colCount": 4,
      "height": 2048,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_2669B134_2C3F_DDCB_41BB_88BE90D98D45_0/l/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2,
      "height": 1024,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_2669B134_2C3F_DDCB_41BB_88BE90D98D45_0/l/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ]
     }
    ],
    "class": "ImageResource"
   },
   "class": "CubicPanoramaFrame",
   "thumbnailUrl": "media/panorama_2669B134_2C3F_DDCB_41BB_88BE90D98D45_t.jpg"
  }
 ],
 "hfovMin": "135%",
 "overlays": [
  "this.overlay_6DCB905E_602B_9501_41B7_2981EF48CBC0",
  "this.overlay_6E9F98AD_6024_9503_41D7_222095F23811",
  "this.overlay_6E1EBC00_6025_8D02_41D1_894B7BE55612",
  "this.overlay_6F5CA1A1_6024_9702_41D7_EB9F64A0B157",
  "this.overlay_777038C2_6064_91EF_41C9_8A7E7E14B24C",
  "this.overlay_77EFC4AB_606B_91BE_41B1_6F226DEC80CC",
  "this.panorama_2669B134_2C3F_DDCB_41BB_88BE90D98D45_tcap0"
 ]
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ]
 },
 "id": "panorama_266AA6A9_2C3C_44DD_4132_A3FBEF2422DE_camera"
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": 84.25,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ]
 },
 "id": "camera_87706DAD_AF0B_6736_41DC_2F62C5A733B6"
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ]
 },
 "id": "panorama_26663B80_2C3C_4CCC_41C4_05539F545C2A_camera"
},
{
 "adjacentPanoramas": [
  {
   "yaw": 88.05,
   "backwardYaw": -133.15,
   "distance": 1,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_2669A39A_2C3C_5CFF_41C0_F596914DA092"
  },
  {
   "yaw": -103.25,
   "backwardYaw": 75.12,
   "distance": 1,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_26667DFA_2C3C_443C_41B2_332913C8F61A"
  },
  {
   "yaw": -6.53,
   "backwardYaw": 137.29,
   "distance": 1,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_266AA6A9_2C3C_44DD_4132_A3FBEF2422DE"
  }
 ],
 "thumbnailUrl": "media/panorama_266A7DB6_2C3C_4437_41C1_235AEE268532_t.jpg",
 "hfov": 360,
 "partial": false,
 "id": "panorama_266A7DB6_2C3C_4437_41C1_235AEE268532",
 "label": "IMG_20220316_110135_00_343",
 "pitch": 0,
 "hfovMax": 130,
 "class": "Panorama",
 "vfov": 180,
 "frames": [
  {
   "front": {
    "levels": [
     {
      "url": "media/panorama_266A7DB6_2C3C_4437_41C1_235AEE268532_0/f/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "width": 2048,
      "colCount": 4,
      "height": 2048,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_266A7DB6_2C3C_4437_41C1_235AEE268532_0/f/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2,
      "height": 1024,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_266A7DB6_2C3C_4437_41C1_235AEE268532_0/f/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ]
     }
    ],
    "class": "ImageResource"
   },
   "top": {
    "levels": [
     {
      "url": "media/panorama_266A7DB6_2C3C_4437_41C1_235AEE268532_0/u/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "width": 2048,
      "colCount": 4,
      "height": 2048,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_266A7DB6_2C3C_4437_41C1_235AEE268532_0/u/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2,
      "height": 1024,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_266A7DB6_2C3C_4437_41C1_235AEE268532_0/u/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ]
     }
    ],
    "class": "ImageResource"
   },
   "right": {
    "levels": [
     {
      "url": "media/panorama_266A7DB6_2C3C_4437_41C1_235AEE268532_0/r/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "width": 2048,
      "colCount": 4,
      "height": 2048,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_266A7DB6_2C3C_4437_41C1_235AEE268532_0/r/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2,
      "height": 1024,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_266A7DB6_2C3C_4437_41C1_235AEE268532_0/r/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ]
     }
    ],
    "class": "ImageResource"
   },
   "back": {
    "levels": [
     {
      "url": "media/panorama_266A7DB6_2C3C_4437_41C1_235AEE268532_0/b/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "width": 2048,
      "colCount": 4,
      "height": 2048,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_266A7DB6_2C3C_4437_41C1_235AEE268532_0/b/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2,
      "height": 1024,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_266A7DB6_2C3C_4437_41C1_235AEE268532_0/b/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ]
     }
    ],
    "class": "ImageResource"
   },
   "bottom": {
    "levels": [
     {
      "url": "media/panorama_266A7DB6_2C3C_4437_41C1_235AEE268532_0/d/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "width": 2048,
      "colCount": 4,
      "height": 2048,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_266A7DB6_2C3C_4437_41C1_235AEE268532_0/d/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2,
      "height": 1024,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_266A7DB6_2C3C_4437_41C1_235AEE268532_0/d/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ]
     }
    ],
    "class": "ImageResource"
   },
   "left": {
    "levels": [
     {
      "url": "media/panorama_266A7DB6_2C3C_4437_41C1_235AEE268532_0/l/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "width": 2048,
      "colCount": 4,
      "height": 2048,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_266A7DB6_2C3C_4437_41C1_235AEE268532_0/l/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2,
      "height": 1024,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_266A7DB6_2C3C_4437_41C1_235AEE268532_0/l/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ]
     }
    ],
    "class": "ImageResource"
   },
   "class": "CubicPanoramaFrame",
   "thumbnailUrl": "media/panorama_266A7DB6_2C3C_4437_41C1_235AEE268532_t.jpg"
  }
 ],
 "hfovMin": "135%",
 "overlays": [
  "this.overlay_4CC5D659_55BA_6848_41B2_6C5044108AD3",
  "this.overlay_4C4BD8FA_55BB_D84B_41BE_3B4E9B860D25",
  "this.overlay_4CF75034_55BA_A7DF_41A0_DFF011EE48D5",
  "this.overlay_4F1B8D0E_55B9_B9CB_41CC_DB1AF41B1939",
  "this.panorama_266A7DB6_2C3C_4437_41C1_235AEE268532_tcap0",
  "this.overlay_BAD6A5D8_AF07_671E_41C8_5D735AE6C7D9",
  "this.overlay_B9AFBC6C_AF07_E536_41CA_45A5571314D2"
 ]
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": 125.86,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ]
 },
 "id": "camera_87E8DCD8_AF0B_651E_419C_4EC163483506"
},
{
 "adjacentPanoramas": [
  {
   "yaw": 145.46,
   "backwardYaw": -36.18,
   "distance": 1,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_2666CCAC_2C3C_C4D4_41B6_6F5BD1BACD46"
  },
  {
   "yaw": -146.71,
   "backwardYaw": -36.18,
   "distance": 1,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_2666CCAC_2C3C_C4D4_41B6_6F5BD1BACD46"
  },
  {
   "yaw": -36.77,
   "backwardYaw": 143.57,
   "distance": 1,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_26663B80_2C3C_4CCC_41C4_05539F545C2A"
  }
 ],
 "thumbnailUrl": "media/panorama_2666F3DA_2C3C_BC7F_41A5_8719A461067F_t.jpg",
 "hfov": 360,
 "partial": false,
 "id": "panorama_2666F3DA_2C3C_BC7F_41A5_8719A461067F",
 "label": "IMG_20220316_113153_00_365",
 "pitch": 0,
 "hfovMax": 130,
 "class": "Panorama",
 "vfov": 180,
 "frames": [
  {
   "front": {
    "levels": [
     {
      "url": "media/panorama_2666F3DA_2C3C_BC7F_41A5_8719A461067F_0/f/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "width": 2048,
      "colCount": 4,
      "height": 2048,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_2666F3DA_2C3C_BC7F_41A5_8719A461067F_0/f/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2,
      "height": 1024,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_2666F3DA_2C3C_BC7F_41A5_8719A461067F_0/f/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ]
     }
    ],
    "class": "ImageResource"
   },
   "top": {
    "levels": [
     {
      "url": "media/panorama_2666F3DA_2C3C_BC7F_41A5_8719A461067F_0/u/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "width": 2048,
      "colCount": 4,
      "height": 2048,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_2666F3DA_2C3C_BC7F_41A5_8719A461067F_0/u/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2,
      "height": 1024,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_2666F3DA_2C3C_BC7F_41A5_8719A461067F_0/u/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ]
     }
    ],
    "class": "ImageResource"
   },
   "right": {
    "levels": [
     {
      "url": "media/panorama_2666F3DA_2C3C_BC7F_41A5_8719A461067F_0/r/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "width": 2048,
      "colCount": 4,
      "height": 2048,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_2666F3DA_2C3C_BC7F_41A5_8719A461067F_0/r/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2,
      "height": 1024,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_2666F3DA_2C3C_BC7F_41A5_8719A461067F_0/r/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ]
     }
    ],
    "class": "ImageResource"
   },
   "back": {
    "levels": [
     {
      "url": "media/panorama_2666F3DA_2C3C_BC7F_41A5_8719A461067F_0/b/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "width": 2048,
      "colCount": 4,
      "height": 2048,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_2666F3DA_2C3C_BC7F_41A5_8719A461067F_0/b/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2,
      "height": 1024,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_2666F3DA_2C3C_BC7F_41A5_8719A461067F_0/b/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ]
     }
    ],
    "class": "ImageResource"
   },
   "bottom": {
    "levels": [
     {
      "url": "media/panorama_2666F3DA_2C3C_BC7F_41A5_8719A461067F_0/d/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "width": 2048,
      "colCount": 4,
      "height": 2048,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_2666F3DA_2C3C_BC7F_41A5_8719A461067F_0/d/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2,
      "height": 1024,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_2666F3DA_2C3C_BC7F_41A5_8719A461067F_0/d/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ]
     }
    ],
    "class": "ImageResource"
   },
   "left": {
    "levels": [
     {
      "url": "media/panorama_2666F3DA_2C3C_BC7F_41A5_8719A461067F_0/l/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "width": 2048,
      "colCount": 4,
      "height": 2048,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_2666F3DA_2C3C_BC7F_41A5_8719A461067F_0/l/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2,
      "height": 1024,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_2666F3DA_2C3C_BC7F_41A5_8719A461067F_0/l/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ]
     }
    ],
    "class": "ImageResource"
   },
   "class": "CubicPanoramaFrame",
   "thumbnailUrl": "media/panorama_2666F3DA_2C3C_BC7F_41A5_8719A461067F_t.jpg"
  }
 ],
 "hfovMin": "135%",
 "overlays": [
  "this.overlay_59B3552C_5546_E9CE_41D1_2C3D7BD9C832",
  "this.overlay_45736F36_555A_59DB_41CB_477BFB29AF13",
  "this.overlay_45929DC6_555A_58BA_419A_6D34E108DEB2",
  "this.overlay_44B9D83F_555E_67C9_41C8_10FD1E21AC60",
  "this.overlay_411EE496_554A_68DA_41C5_B68ADB1D6FE6",
  "this.panorama_2666F3DA_2C3C_BC7F_41A5_8719A461067F_tcap0"
 ]
},
{
 "adjacentPanoramas": [
  {
   "yaw": -21.47,
   "backwardYaw": -67.57,
   "distance": 1,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_274E4A2E_2C3D_CFD7_41C3_E749466BFD9F"
  },
  {
   "yaw": 133.9,
   "backwardYaw": 3.89,
   "distance": 1,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_266A48C5_2C3C_4C55_41B3_1D70C2050903"
  }
 ],
 "thumbnailUrl": "media/panorama_26667EAB_2C3C_44DC_41BD_508AF18BD0E5_t.jpg",
 "hfov": 360,
 "partial": false,
 "id": "panorama_26667EAB_2C3C_44DC_41BD_508AF18BD0E5",
 "label": "IMG_20220316_103817_00_325",
 "pitch": 0,
 "hfovMax": 130,
 "class": "Panorama",
 "vfov": 180,
 "frames": [
  {
   "front": {
    "levels": [
     {
      "url": "media/panorama_26667EAB_2C3C_44DC_41BD_508AF18BD0E5_0/f/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "width": 2048,
      "colCount": 4,
      "height": 2048,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_26667EAB_2C3C_44DC_41BD_508AF18BD0E5_0/f/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2,
      "height": 1024,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_26667EAB_2C3C_44DC_41BD_508AF18BD0E5_0/f/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ]
     }
    ],
    "class": "ImageResource"
   },
   "top": {
    "levels": [
     {
      "url": "media/panorama_26667EAB_2C3C_44DC_41BD_508AF18BD0E5_0/u/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "width": 2048,
      "colCount": 4,
      "height": 2048,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_26667EAB_2C3C_44DC_41BD_508AF18BD0E5_0/u/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2,
      "height": 1024,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_26667EAB_2C3C_44DC_41BD_508AF18BD0E5_0/u/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ]
     }
    ],
    "class": "ImageResource"
   },
   "right": {
    "levels": [
     {
      "url": "media/panorama_26667EAB_2C3C_44DC_41BD_508AF18BD0E5_0/r/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "width": 2048,
      "colCount": 4,
      "height": 2048,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_26667EAB_2C3C_44DC_41BD_508AF18BD0E5_0/r/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2,
      "height": 1024,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_26667EAB_2C3C_44DC_41BD_508AF18BD0E5_0/r/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ]
     }
    ],
    "class": "ImageResource"
   },
   "back": {
    "levels": [
     {
      "url": "media/panorama_26667EAB_2C3C_44DC_41BD_508AF18BD0E5_0/b/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "width": 2048,
      "colCount": 4,
      "height": 2048,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_26667EAB_2C3C_44DC_41BD_508AF18BD0E5_0/b/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2,
      "height": 1024,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_26667EAB_2C3C_44DC_41BD_508AF18BD0E5_0/b/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ]
     }
    ],
    "class": "ImageResource"
   },
   "bottom": {
    "levels": [
     {
      "url": "media/panorama_26667EAB_2C3C_44DC_41BD_508AF18BD0E5_0/d/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "width": 2048,
      "colCount": 4,
      "height": 2048,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_26667EAB_2C3C_44DC_41BD_508AF18BD0E5_0/d/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2,
      "height": 1024,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_26667EAB_2C3C_44DC_41BD_508AF18BD0E5_0/d/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ]
     }
    ],
    "class": "ImageResource"
   },
   "left": {
    "levels": [
     {
      "url": "media/panorama_26667EAB_2C3C_44DC_41BD_508AF18BD0E5_0/l/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "width": 2048,
      "colCount": 4,
      "height": 2048,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_26667EAB_2C3C_44DC_41BD_508AF18BD0E5_0/l/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2,
      "height": 1024,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_26667EAB_2C3C_44DC_41BD_508AF18BD0E5_0/l/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ]
     }
    ],
    "class": "ImageResource"
   },
   "class": "CubicPanoramaFrame",
   "thumbnailUrl": "media/panorama_26667EAB_2C3C_44DC_41BD_508AF18BD0E5_t.jpg"
  }
 ],
 "hfovMin": "135%",
 "overlays": [
  "this.overlay_3F0A7D94_2C44_44F4_419A_DD2368472762",
  "this.overlay_3A37B823_2C44_4BCD_41B0_EFAE159307E0",
  "this.overlay_387C65FD_2C3C_4434_41C5_237ACFD61079",
  "this.overlay_38CB08EC_2C3C_CC5B_41B5_5C69CB79D9AD",
  "this.panorama_26667EAB_2C3C_44DC_41BD_508AF18BD0E5_tcap0"
 ]
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": 173.47,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ]
 },
 "id": "camera_86EB7E1E_AF0B_6512_41CC_3E5900F4D50C"
},
{
 "adjacentPanoramas": [
  {
   "yaw": -91.32,
   "backwardYaw": 79.8,
   "distance": 1,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_266ACC21_2C3C_CBCD_41B6_407672D395B3"
  }
 ],
 "thumbnailUrl": "media/panorama_266A4FDB_2C3C_447D_41C1_296818159F21_t.jpg",
 "hfov": 360,
 "partial": false,
 "id": "panorama_266A4FDB_2C3C_447D_41C1_296818159F21",
 "label": "IMG_20220316_104336_00_329",
 "pitch": 0,
 "hfovMax": 130,
 "class": "Panorama",
 "vfov": 180,
 "frames": [
  {
   "front": {
    "levels": [
     {
      "url": "media/panorama_266A4FDB_2C3C_447D_41C1_296818159F21_0/f/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "width": 2048,
      "colCount": 4,
      "height": 2048,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_266A4FDB_2C3C_447D_41C1_296818159F21_0/f/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2,
      "height": 1024,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_266A4FDB_2C3C_447D_41C1_296818159F21_0/f/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ]
     }
    ],
    "class": "ImageResource"
   },
   "top": {
    "levels": [
     {
      "url": "media/panorama_266A4FDB_2C3C_447D_41C1_296818159F21_0/u/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "width": 2048,
      "colCount": 4,
      "height": 2048,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_266A4FDB_2C3C_447D_41C1_296818159F21_0/u/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2,
      "height": 1024,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_266A4FDB_2C3C_447D_41C1_296818159F21_0/u/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ]
     }
    ],
    "class": "ImageResource"
   },
   "right": {
    "levels": [
     {
      "url": "media/panorama_266A4FDB_2C3C_447D_41C1_296818159F21_0/r/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "width": 2048,
      "colCount": 4,
      "height": 2048,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_266A4FDB_2C3C_447D_41C1_296818159F21_0/r/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2,
      "height": 1024,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_266A4FDB_2C3C_447D_41C1_296818159F21_0/r/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ]
     }
    ],
    "class": "ImageResource"
   },
   "back": {
    "levels": [
     {
      "url": "media/panorama_266A4FDB_2C3C_447D_41C1_296818159F21_0/b/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "width": 2048,
      "colCount": 4,
      "height": 2048,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_266A4FDB_2C3C_447D_41C1_296818159F21_0/b/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2,
      "height": 1024,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_266A4FDB_2C3C_447D_41C1_296818159F21_0/b/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ]
     }
    ],
    "class": "ImageResource"
   },
   "bottom": {
    "levels": [
     {
      "url": "media/panorama_266A4FDB_2C3C_447D_41C1_296818159F21_0/d/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "width": 2048,
      "colCount": 4,
      "height": 2048,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_266A4FDB_2C3C_447D_41C1_296818159F21_0/d/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2,
      "height": 1024,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_266A4FDB_2C3C_447D_41C1_296818159F21_0/d/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ]
     }
    ],
    "class": "ImageResource"
   },
   "left": {
    "levels": [
     {
      "url": "media/panorama_266A4FDB_2C3C_447D_41C1_296818159F21_0/l/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "width": 2048,
      "colCount": 4,
      "height": 2048,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_266A4FDB_2C3C_447D_41C1_296818159F21_0/l/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2,
      "height": 1024,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_266A4FDB_2C3C_447D_41C1_296818159F21_0/l/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ]
     }
    ],
    "class": "ImageResource"
   },
   "class": "CubicPanoramaFrame",
   "thumbnailUrl": "media/panorama_266A4FDB_2C3C_447D_41C1_296818159F21_t.jpg"
  }
 ],
 "hfovMin": "135%",
 "overlays": [
  "this.overlay_412B20FE_60DD_9196_41D7_20CFB232AE66",
  "this.overlay_42A671E9_60DC_93BA_41D4_7D7658E38488",
  "this.panorama_266A4FDB_2C3C_447D_41C1_296818159F21_tcap0"
 ]
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": -81.52,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ]
 },
 "id": "camera_8731BDEF_AF0B_6732_41DB_0AE4A495391D"
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ]
 },
 "id": "panorama_26667EAB_2C3C_44DC_41BD_508AF18BD0E5_camera"
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": 158.53,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ]
 },
 "id": "camera_872ADDDB_AF0B_6712_41E3_02A30A8DAEDC"
},
{
 "adjacentPanoramas": [
  {
   "yaw": 143.07,
   "backwardYaw": -97.22,
   "distance": 1,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_266ACC21_2C3C_CBCD_41B6_407672D395B3"
  },
  {
   "yaw": -14.57,
   "backwardYaw": -118.9,
   "distance": 1,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_266A40B1_2C3C_7CCD_41B2_B5FCEE869E17"
  }
 ],
 "thumbnailUrl": "media/panorama_266A5334_2C3C_BDCB_41C0_5ECFC0F03DE9_t.jpg",
 "hfov": 360,
 "partial": false,
 "id": "panorama_266A5334_2C3C_BDCB_41C0_5ECFC0F03DE9",
 "label": "IMG_20220316_105413_00_338",
 "pitch": 0,
 "hfovMax": 130,
 "class": "Panorama",
 "vfov": 180,
 "frames": [
  {
   "front": {
    "levels": [
     {
      "url": "media/panorama_266A5334_2C3C_BDCB_41C0_5ECFC0F03DE9_0/f/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "width": 2048,
      "colCount": 4,
      "height": 2048,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_266A5334_2C3C_BDCB_41C0_5ECFC0F03DE9_0/f/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2,
      "height": 1024,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_266A5334_2C3C_BDCB_41C0_5ECFC0F03DE9_0/f/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ]
     }
    ],
    "class": "ImageResource"
   },
   "top": {
    "levels": [
     {
      "url": "media/panorama_266A5334_2C3C_BDCB_41C0_5ECFC0F03DE9_0/u/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "width": 2048,
      "colCount": 4,
      "height": 2048,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_266A5334_2C3C_BDCB_41C0_5ECFC0F03DE9_0/u/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2,
      "height": 1024,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_266A5334_2C3C_BDCB_41C0_5ECFC0F03DE9_0/u/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ]
     }
    ],
    "class": "ImageResource"
   },
   "right": {
    "levels": [
     {
      "url": "media/panorama_266A5334_2C3C_BDCB_41C0_5ECFC0F03DE9_0/r/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "width": 2048,
      "colCount": 4,
      "height": 2048,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_266A5334_2C3C_BDCB_41C0_5ECFC0F03DE9_0/r/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2,
      "height": 1024,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_266A5334_2C3C_BDCB_41C0_5ECFC0F03DE9_0/r/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ]
     }
    ],
    "class": "ImageResource"
   },
   "back": {
    "levels": [
     {
      "url": "media/panorama_266A5334_2C3C_BDCB_41C0_5ECFC0F03DE9_0/b/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "width": 2048,
      "colCount": 4,
      "height": 2048,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_266A5334_2C3C_BDCB_41C0_5ECFC0F03DE9_0/b/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2,
      "height": 1024,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_266A5334_2C3C_BDCB_41C0_5ECFC0F03DE9_0/b/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ]
     }
    ],
    "class": "ImageResource"
   },
   "bottom": {
    "levels": [
     {
      "url": "media/panorama_266A5334_2C3C_BDCB_41C0_5ECFC0F03DE9_0/d/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "width": 2048,
      "colCount": 4,
      "height": 2048,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_266A5334_2C3C_BDCB_41C0_5ECFC0F03DE9_0/d/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2,
      "height": 1024,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_266A5334_2C3C_BDCB_41C0_5ECFC0F03DE9_0/d/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ]
     }
    ],
    "class": "ImageResource"
   },
   "left": {
    "levels": [
     {
      "url": "media/panorama_266A5334_2C3C_BDCB_41C0_5ECFC0F03DE9_0/l/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "width": 2048,
      "colCount": 4,
      "height": 2048,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_266A5334_2C3C_BDCB_41C0_5ECFC0F03DE9_0/l/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2,
      "height": 1024,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_266A5334_2C3C_BDCB_41C0_5ECFC0F03DE9_0/l/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ]
     }
    ],
    "class": "ImageResource"
   },
   "class": "CubicPanoramaFrame",
   "thumbnailUrl": "media/panorama_266A5334_2C3C_BDCB_41C0_5ECFC0F03DE9_t.jpg"
  }
 ],
 "hfovMin": "135%",
 "overlays": [
  "this.overlay_400A112D_60DC_90BA_41A0_747940A4E655",
  "this.overlay_41621FBB_60DC_8F9D_41D7_B64E8E7928AD",
  "this.overlay_4129BE12_60DF_906F_41CD_05918313E09C",
  "this.overlay_41A24EA7_60DC_F1B6_41C9_4F60C856A503",
  "this.panorama_266A5334_2C3C_BDCB_41C0_5ECFC0F03DE9_tcap0"
 ]
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": 173.72,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ]
 },
 "id": "camera_85F61F36_AF0B_6312_41C9_DF23A33A6206"
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": -75.37,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ]
 },
 "id": "camera_87471DC7_AF0B_6772_41E5_98C0EE5073C3"
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": 165.43,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ]
 },
 "id": "camera_8707AE04_AF0B_64F6_41E3_69714706F3FF"
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": 96.41,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ]
 },
 "id": "camera_8668EEB0_AF0B_652E_41D8_621A892DE8FF"
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ]
 },
 "id": "panorama_266A4FDB_2C3C_447D_41C1_296818159F21_camera"
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": 68.58,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ]
 },
 "id": "camera_8727EDE5_AF0B_6736_41C9_B28C1B78E18E"
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": 173.72,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ]
 },
 "id": "camera_85C47F41_AF0B_636E_41DC_6E2945DC72B7"
},
{
 "adjacentPanoramas": [
  {
   "yaw": -74.81,
   "backwardYaw": 98.73,
   "distance": 1,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_26660E76_2C3C_C437_41C0_4932F3D787B3"
  },
  {
   "yaw": -180,
   "backwardYaw": 156.36,
   "distance": 1,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_26664293_2C3C_5CCD_41B6_BA5F5C9DBD4C"
  }
 ],
 "thumbnailUrl": "media/panorama_2666F540_2C3C_C44C_41C0_1FA76F1EECB2_t.jpg",
 "hfov": 360,
 "partial": false,
 "id": "panorama_2666F540_2C3C_C44C_41C0_1FA76F1EECB2",
 "label": "IMG_20220316_113624_00_368",
 "pitch": 0,
 "hfovMax": 130,
 "class": "Panorama",
 "vfov": 180,
 "frames": [
  {
   "front": {
    "levels": [
     {
      "url": "media/panorama_2666F540_2C3C_C44C_41C0_1FA76F1EECB2_0/f/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "width": 2048,
      "colCount": 4,
      "height": 2048,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_2666F540_2C3C_C44C_41C0_1FA76F1EECB2_0/f/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2,
      "height": 1024,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_2666F540_2C3C_C44C_41C0_1FA76F1EECB2_0/f/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ]
     }
    ],
    "class": "ImageResource"
   },
   "top": {
    "levels": [
     {
      "url": "media/panorama_2666F540_2C3C_C44C_41C0_1FA76F1EECB2_0/u/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "width": 2048,
      "colCount": 4,
      "height": 2048,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_2666F540_2C3C_C44C_41C0_1FA76F1EECB2_0/u/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2,
      "height": 1024,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_2666F540_2C3C_C44C_41C0_1FA76F1EECB2_0/u/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ]
     }
    ],
    "class": "ImageResource"
   },
   "right": {
    "levels": [
     {
      "url": "media/panorama_2666F540_2C3C_C44C_41C0_1FA76F1EECB2_0/r/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "width": 2048,
      "colCount": 4,
      "height": 2048,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_2666F540_2C3C_C44C_41C0_1FA76F1EECB2_0/r/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2,
      "height": 1024,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_2666F540_2C3C_C44C_41C0_1FA76F1EECB2_0/r/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ]
     }
    ],
    "class": "ImageResource"
   },
   "back": {
    "levels": [
     {
      "url": "media/panorama_2666F540_2C3C_C44C_41C0_1FA76F1EECB2_0/b/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "width": 2048,
      "colCount": 4,
      "height": 2048,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_2666F540_2C3C_C44C_41C0_1FA76F1EECB2_0/b/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2,
      "height": 1024,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_2666F540_2C3C_C44C_41C0_1FA76F1EECB2_0/b/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ]
     }
    ],
    "class": "ImageResource"
   },
   "bottom": {
    "levels": [
     {
      "url": "media/panorama_2666F540_2C3C_C44C_41C0_1FA76F1EECB2_0/d/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "width": 2048,
      "colCount": 4,
      "height": 2048,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_2666F540_2C3C_C44C_41C0_1FA76F1EECB2_0/d/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2,
      "height": 1024,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_2666F540_2C3C_C44C_41C0_1FA76F1EECB2_0/d/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ]
     }
    ],
    "class": "ImageResource"
   },
   "left": {
    "levels": [
     {
      "url": "media/panorama_2666F540_2C3C_C44C_41C0_1FA76F1EECB2_0/l/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "width": 2048,
      "colCount": 4,
      "height": 2048,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_2666F540_2C3C_C44C_41C0_1FA76F1EECB2_0/l/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2,
      "height": 1024,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_2666F540_2C3C_C44C_41C0_1FA76F1EECB2_0/l/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ]
     }
    ],
    "class": "ImageResource"
   },
   "class": "CubicPanoramaFrame",
   "thumbnailUrl": "media/panorama_2666F540_2C3C_C44C_41C0_1FA76F1EECB2_t.jpg"
  }
 ],
 "hfovMin": "135%",
 "overlays": [
  "this.overlay_7AE2CCD7_606D_B195_41CB_EA6452F88F36",
  "this.overlay_7A9E887E_606D_B096_41CC_317E8FAD0BBF",
  "this.overlay_7CCBD0E2_606C_91AE_41CF_E294FC9315A7",
  "this.overlay_7AA844EB_606F_91BE_41C8_0200A57B9262",
  "this.panorama_2666F540_2C3C_C44C_41C0_1FA76F1EECB2_tcap0"
 ]
},
{
 "adjacentPanoramas": [
  {
   "yaw": -6.28,
   "backwardYaw": 140.43,
   "distance": 1,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_266ABC73_2C3C_444D_41A2_D12FEAAC1356"
  },
  {
   "yaw": 137.29,
   "backwardYaw": -6.53,
   "distance": 1,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_266A7DB6_2C3C_4437_41C1_235AEE268532"
  }
 ],
 "thumbnailUrl": "media/panorama_266AA6A9_2C3C_44DD_4132_A3FBEF2422DE_t.jpg",
 "hfov": 360,
 "partial": false,
 "id": "panorama_266AA6A9_2C3C_44DD_4132_A3FBEF2422DE",
 "label": "IMG_20220316_105652_00_340",
 "pitch": 0,
 "hfovMax": 130,
 "class": "Panorama",
 "vfov": 180,
 "frames": [
  {
   "front": {
    "levels": [
     {
      "url": "media/panorama_266AA6A9_2C3C_44DD_4132_A3FBEF2422DE_0/f/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "width": 2048,
      "colCount": 4,
      "height": 2048,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_266AA6A9_2C3C_44DD_4132_A3FBEF2422DE_0/f/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2,
      "height": 1024,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_266AA6A9_2C3C_44DD_4132_A3FBEF2422DE_0/f/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ]
     }
    ],
    "class": "ImageResource"
   },
   "top": {
    "levels": [
     {
      "url": "media/panorama_266AA6A9_2C3C_44DD_4132_A3FBEF2422DE_0/u/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "width": 2048,
      "colCount": 4,
      "height": 2048,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_266AA6A9_2C3C_44DD_4132_A3FBEF2422DE_0/u/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2,
      "height": 1024,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_266AA6A9_2C3C_44DD_4132_A3FBEF2422DE_0/u/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ]
     }
    ],
    "class": "ImageResource"
   },
   "right": {
    "levels": [
     {
      "url": "media/panorama_266AA6A9_2C3C_44DD_4132_A3FBEF2422DE_0/r/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "width": 2048,
      "colCount": 4,
      "height": 2048,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_266AA6A9_2C3C_44DD_4132_A3FBEF2422DE_0/r/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2,
      "height": 1024,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_266AA6A9_2C3C_44DD_4132_A3FBEF2422DE_0/r/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ]
     }
    ],
    "class": "ImageResource"
   },
   "back": {
    "levels": [
     {
      "url": "media/panorama_266AA6A9_2C3C_44DD_4132_A3FBEF2422DE_0/b/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "width": 2048,
      "colCount": 4,
      "height": 2048,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_266AA6A9_2C3C_44DD_4132_A3FBEF2422DE_0/b/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2,
      "height": 1024,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_266AA6A9_2C3C_44DD_4132_A3FBEF2422DE_0/b/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ]
     }
    ],
    "class": "ImageResource"
   },
   "bottom": {
    "levels": [
     {
      "url": "media/panorama_266AA6A9_2C3C_44DD_4132_A3FBEF2422DE_0/d/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "width": 2048,
      "colCount": 4,
      "height": 2048,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_266AA6A9_2C3C_44DD_4132_A3FBEF2422DE_0/d/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2,
      "height": 1024,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_266AA6A9_2C3C_44DD_4132_A3FBEF2422DE_0/d/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ]
     }
    ],
    "class": "ImageResource"
   },
   "left": {
    "levels": [
     {
      "url": "media/panorama_266AA6A9_2C3C_44DD_4132_A3FBEF2422DE_0/l/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "width": 2048,
      "colCount": 4,
      "height": 2048,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_266AA6A9_2C3C_44DD_4132_A3FBEF2422DE_0/l/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2,
      "height": 1024,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_266AA6A9_2C3C_44DD_4132_A3FBEF2422DE_0/l/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ]
     }
    ],
    "class": "ImageResource"
   },
   "class": "CubicPanoramaFrame",
   "thumbnailUrl": "media/panorama_266AA6A9_2C3C_44DD_4132_A3FBEF2422DE_t.jpg"
  }
 ],
 "hfovMin": "135%",
 "overlays": [
  "this.panorama_266AA6A9_2C3C_44DD_4132_A3FBEF2422DE_tcap0",
  "this.overlay_B7D02137_AF0A_DF12_41D1_4F7699CEC4B6",
  "this.overlay_B62A6EEB_AF09_E532_41C0_D5E940A1D547",
  "this.overlay_B7C6B698_AF06_E51E_41E4_4046469B8F92",
  "this.overlay_B3A6BB0B_AF09_ACF2_41D1_2DD6DD21AA73",
  "this.overlay_B2D68551_AF1A_A76E_41E2_A9046EE11187"
 ]
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": -36.43,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ]
 },
 "id": "camera_86C8FE40_AF0B_656E_41D1_A752FD0B1841"
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ]
 },
 "id": "panorama_2669A39A_2C3C_5CFF_41C0_F596914DA092_camera"
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": 104.87,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ]
 },
 "id": "camera_87F81CFB_AF0B_6512_41C4_0906C5BB57DE"
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": 143.82,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ]
 },
 "id": "camera_86FE2E35_AF0B_6516_41DD_73457641BB7F"
},
{
 "adjacentPanoramas": [
  {
   "yaw": 1.85,
   "backwardYaw": 87.9,
   "distance": 1,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_26666712_2C3C_C5CF_4198_822E2A8C8DCC"
  }
 ],
 "thumbnailUrl": "media/panorama_26661FEC_2C3C_C45B_419B_861471116CC7_t.jpg",
 "hfov": 360,
 "partial": false,
 "id": "panorama_26661FEC_2C3C_C45B_419B_861471116CC7",
 "label": "IMG_20220316_122312_00_375",
 "pitch": 0,
 "hfovMax": 130,
 "class": "Panorama",
 "vfov": 180,
 "frames": [
  {
   "front": {
    "levels": [
     {
      "url": "media/panorama_26661FEC_2C3C_C45B_419B_861471116CC7_0/f/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "width": 2048,
      "colCount": 4,
      "height": 2048,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_26661FEC_2C3C_C45B_419B_861471116CC7_0/f/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2,
      "height": 1024,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_26661FEC_2C3C_C45B_419B_861471116CC7_0/f/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ]
     }
    ],
    "class": "ImageResource"
   },
   "top": {
    "levels": [
     {
      "url": "media/panorama_26661FEC_2C3C_C45B_419B_861471116CC7_0/u/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "width": 2048,
      "colCount": 4,
      "height": 2048,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_26661FEC_2C3C_C45B_419B_861471116CC7_0/u/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2,
      "height": 1024,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_26661FEC_2C3C_C45B_419B_861471116CC7_0/u/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ]
     }
    ],
    "class": "ImageResource"
   },
   "right": {
    "levels": [
     {
      "url": "media/panorama_26661FEC_2C3C_C45B_419B_861471116CC7_0/r/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "width": 2048,
      "colCount": 4,
      "height": 2048,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_26661FEC_2C3C_C45B_419B_861471116CC7_0/r/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2,
      "height": 1024,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_26661FEC_2C3C_C45B_419B_861471116CC7_0/r/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ]
     }
    ],
    "class": "ImageResource"
   },
   "back": {
    "levels": [
     {
      "url": "media/panorama_26661FEC_2C3C_C45B_419B_861471116CC7_0/b/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "width": 2048,
      "colCount": 4,
      "height": 2048,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_26661FEC_2C3C_C45B_419B_861471116CC7_0/b/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2,
      "height": 1024,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_26661FEC_2C3C_C45B_419B_861471116CC7_0/b/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ]
     }
    ],
    "class": "ImageResource"
   },
   "bottom": {
    "levels": [
     {
      "url": "media/panorama_26661FEC_2C3C_C45B_419B_861471116CC7_0/d/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "width": 2048,
      "colCount": 4,
      "height": 2048,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_26661FEC_2C3C_C45B_419B_861471116CC7_0/d/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2,
      "height": 1024,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_26661FEC_2C3C_C45B_419B_861471116CC7_0/d/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ]
     }
    ],
    "class": "ImageResource"
   },
   "left": {
    "levels": [
     {
      "url": "media/panorama_26661FEC_2C3C_C45B_419B_861471116CC7_0/l/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "width": 2048,
      "colCount": 4,
      "height": 2048,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_26661FEC_2C3C_C45B_419B_861471116CC7_0/l/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2,
      "height": 1024,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_26661FEC_2C3C_C45B_419B_861471116CC7_0/l/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ]
     }
    ],
    "class": "ImageResource"
   },
   "class": "CubicPanoramaFrame",
   "thumbnailUrl": "media/panorama_26661FEC_2C3C_C45B_419B_861471116CC7_t.jpg"
  }
 ],
 "hfovMin": "135%",
 "overlays": [
  "this.panorama_26661FEC_2C3C_C45B_419B_861471116CC7_tcap0",
  "this.overlay_8D7AF4D9_AF7A_E51E_4191_193976FC98E3",
  "this.overlay_8AAB8A2D_AF7B_6D36_41BC_22E3835FB9B6"
 ]
},
{
 "adjacentPanoramas": [
  {
   "yaw": -54.14,
   "backwardYaw": -32.41,
   "distance": 1,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_26663B80_2C3C_4CCC_41C4_05539F545C2A"
  },
  {
   "yaw": 156.36,
   "backwardYaw": -180,
   "distance": 1,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_2666F540_2C3C_C44C_41C0_1FA76F1EECB2"
  },
  {
   "yaw": 98.48,
   "backwardYaw": 128.12,
   "distance": 1,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_266A40B1_2C3C_7CCD_41B2_B5FCEE869E17"
  }
 ],
 "thumbnailUrl": "media/panorama_26664293_2C3C_5CCD_41B6_BA5F5C9DBD4C_t.jpg",
 "hfov": 360,
 "partial": false,
 "id": "panorama_26664293_2C3C_5CCD_41B6_BA5F5C9DBD4C",
 "label": "IMG_20220316_112812_00_362",
 "pitch": 0,
 "hfovMax": 130,
 "class": "Panorama",
 "vfov": 180,
 "frames": [
  {
   "front": {
    "levels": [
     {
      "url": "media/panorama_26664293_2C3C_5CCD_41B6_BA5F5C9DBD4C_0/f/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "width": 2048,
      "colCount": 4,
      "height": 2048,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_26664293_2C3C_5CCD_41B6_BA5F5C9DBD4C_0/f/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2,
      "height": 1024,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_26664293_2C3C_5CCD_41B6_BA5F5C9DBD4C_0/f/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ]
     }
    ],
    "class": "ImageResource"
   },
   "top": {
    "levels": [
     {
      "url": "media/panorama_26664293_2C3C_5CCD_41B6_BA5F5C9DBD4C_0/u/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "width": 2048,
      "colCount": 4,
      "height": 2048,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_26664293_2C3C_5CCD_41B6_BA5F5C9DBD4C_0/u/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2,
      "height": 1024,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_26664293_2C3C_5CCD_41B6_BA5F5C9DBD4C_0/u/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ]
     }
    ],
    "class": "ImageResource"
   },
   "right": {
    "levels": [
     {
      "url": "media/panorama_26664293_2C3C_5CCD_41B6_BA5F5C9DBD4C_0/r/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "width": 2048,
      "colCount": 4,
      "height": 2048,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_26664293_2C3C_5CCD_41B6_BA5F5C9DBD4C_0/r/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2,
      "height": 1024,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_26664293_2C3C_5CCD_41B6_BA5F5C9DBD4C_0/r/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ]
     }
    ],
    "class": "ImageResource"
   },
   "back": {
    "levels": [
     {
      "url": "media/panorama_26664293_2C3C_5CCD_41B6_BA5F5C9DBD4C_0/b/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "width": 2048,
      "colCount": 4,
      "height": 2048,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_26664293_2C3C_5CCD_41B6_BA5F5C9DBD4C_0/b/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2,
      "height": 1024,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_26664293_2C3C_5CCD_41B6_BA5F5C9DBD4C_0/b/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ]
     }
    ],
    "class": "ImageResource"
   },
   "bottom": {
    "levels": [
     {
      "url": "media/panorama_26664293_2C3C_5CCD_41B6_BA5F5C9DBD4C_0/d/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "width": 2048,
      "colCount": 4,
      "height": 2048,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_26664293_2C3C_5CCD_41B6_BA5F5C9DBD4C_0/d/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2,
      "height": 1024,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_26664293_2C3C_5CCD_41B6_BA5F5C9DBD4C_0/d/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ]
     }
    ],
    "class": "ImageResource"
   },
   "left": {
    "levels": [
     {
      "url": "media/panorama_26664293_2C3C_5CCD_41B6_BA5F5C9DBD4C_0/l/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "width": 2048,
      "colCount": 4,
      "height": 2048,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_26664293_2C3C_5CCD_41B6_BA5F5C9DBD4C_0/l/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2,
      "height": 1024,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_26664293_2C3C_5CCD_41B6_BA5F5C9DBD4C_0/l/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ]
     }
    ],
    "class": "ImageResource"
   },
   "class": "CubicPanoramaFrame",
   "thumbnailUrl": "media/panorama_26664293_2C3C_5CCD_41B6_BA5F5C9DBD4C_t.jpg"
  }
 ],
 "hfovMin": "135%",
 "overlays": [
  "this.overlay_4362CC2A_5547_BFCB_41BB_5B5114774928",
  "this.overlay_4239118A_5546_A8CB_41CA_F25022034F96",
  "this.overlay_7C9D7E62_6067_90AE_41C3_1B402EA1DC2A",
  "this.overlay_7AFDB1F9_606B_939A_41D2_D4997155D235",
  "this.overlay_7BAEA7AA_605C_9FBF_41C5_2F69003B3824",
  "this.overlay_7C6FC489_605F_B07A_41A6_EC170A320204",
  "this.panorama_26664293_2C3C_5CCD_41B6_BA5F5C9DBD4C_tcap0"
 ]
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": -91.95,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ]
 },
 "id": "camera_85A1FF56_AF0B_6312_41E0_5C78EB135768"
},
{
 "adjacentPanoramas": [
  {
   "yaw": 2.95,
   "backwardYaw": 98.98,
   "distance": 1,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_266A36EB_2C3C_C45D_41A9_B83C69110285"
  },
  {
   "yaw": 140.43,
   "backwardYaw": -6.28,
   "distance": 1,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_266AA6A9_2C3C_44DD_4132_A3FBEF2422DE"
  },
  {
   "yaw": -143.95,
   "backwardYaw": -6.28,
   "distance": 1,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_266AA6A9_2C3C_44DD_4132_A3FBEF2422DE"
  }
 ],
 "thumbnailUrl": "media/panorama_266ABC73_2C3C_444D_41A2_D12FEAAC1356_t.jpg",
 "hfov": 360,
 "partial": false,
 "id": "panorama_266ABC73_2C3C_444D_41A2_D12FEAAC1356",
 "label": "IMG_20220316_105454_00_339",
 "pitch": 0,
 "hfovMax": 130,
 "class": "Panorama",
 "vfov": 180,
 "frames": [
  {
   "front": {
    "levels": [
     {
      "url": "media/panorama_266ABC73_2C3C_444D_41A2_D12FEAAC1356_0/f/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "width": 2048,
      "colCount": 4,
      "height": 2048,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_266ABC73_2C3C_444D_41A2_D12FEAAC1356_0/f/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2,
      "height": 1024,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_266ABC73_2C3C_444D_41A2_D12FEAAC1356_0/f/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ]
     }
    ],
    "class": "ImageResource"
   },
   "top": {
    "levels": [
     {
      "url": "media/panorama_266ABC73_2C3C_444D_41A2_D12FEAAC1356_0/u/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "width": 2048,
      "colCount": 4,
      "height": 2048,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_266ABC73_2C3C_444D_41A2_D12FEAAC1356_0/u/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2,
      "height": 1024,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_266ABC73_2C3C_444D_41A2_D12FEAAC1356_0/u/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ]
     }
    ],
    "class": "ImageResource"
   },
   "right": {
    "levels": [
     {
      "url": "media/panorama_266ABC73_2C3C_444D_41A2_D12FEAAC1356_0/r/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "width": 2048,
      "colCount": 4,
      "height": 2048,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_266ABC73_2C3C_444D_41A2_D12FEAAC1356_0/r/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2,
      "height": 1024,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_266ABC73_2C3C_444D_41A2_D12FEAAC1356_0/r/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ]
     }
    ],
    "class": "ImageResource"
   },
   "back": {
    "levels": [
     {
      "url": "media/panorama_266ABC73_2C3C_444D_41A2_D12FEAAC1356_0/b/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "width": 2048,
      "colCount": 4,
      "height": 2048,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_266ABC73_2C3C_444D_41A2_D12FEAAC1356_0/b/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2,
      "height": 1024,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_266ABC73_2C3C_444D_41A2_D12FEAAC1356_0/b/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ]
     }
    ],
    "class": "ImageResource"
   },
   "bottom": {
    "levels": [
     {
      "url": "media/panorama_266ABC73_2C3C_444D_41A2_D12FEAAC1356_0/d/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "width": 2048,
      "colCount": 4,
      "height": 2048,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_266ABC73_2C3C_444D_41A2_D12FEAAC1356_0/d/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2,
      "height": 1024,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_266ABC73_2C3C_444D_41A2_D12FEAAC1356_0/d/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ]
     }
    ],
    "class": "ImageResource"
   },
   "left": {
    "levels": [
     {
      "url": "media/panorama_266ABC73_2C3C_444D_41A2_D12FEAAC1356_0/l/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "width": 2048,
      "colCount": 4,
      "height": 2048,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_266ABC73_2C3C_444D_41A2_D12FEAAC1356_0/l/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2,
      "height": 1024,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_266ABC73_2C3C_444D_41A2_D12FEAAC1356_0/l/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ]
     }
    ],
    "class": "ImageResource"
   },
   "class": "CubicPanoramaFrame",
   "thumbnailUrl": "media/panorama_266ABC73_2C3C_444D_41A2_D12FEAAC1356_t.jpg"
  }
 ],
 "hfovMin": "135%",
 "overlays": [
  "this.panorama_266ABC73_2C3C_444D_41A2_D12FEAAC1356_tcap0",
  "this.overlay_B65CDD70_AF19_A72D_41E1_C44C1D38D707",
  "this.overlay_B6966177_AF1A_FF12_41D3_C5CA208D48DB",
  "this.overlay_B5F0EB39_AF1B_A31E_41C9_8D62850E5218",
  "this.overlay_B516C808_AF0F_ACFD_41E2_347E09512943",
  "this.overlay_B173B151_AF06_BF6E_41DF_0C0EE37055CD"
 ]
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": -42.71,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ]
 },
 "id": "camera_87D5ED38_AF0B_671E_41E0_B35ACC9C5085"
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ]
 },
 "id": "panorama_266A48C5_2C3C_4C55_41B3_1D70C2050903_camera"
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": -104.88,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ]
 },
 "id": "camera_87DACD2E_AF0B_6732_41D4_93C9A58EC417"
},
{
 "adjacentPanoramas": [
  {
   "yaw": -116.06,
   "backwardYaw": 108.9,
   "distance": 1,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_2669B134_2C3F_DDCB_41BB_88BE90D98D45"
  },
  {
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_2669D8F8_2C3F_CC3B_41C4_43F82B11C465"
  }
 ],
 "thumbnailUrl": "media/panorama_2669CA02_2C3F_CFCF_41C1_E694A5B56234_t.jpg",
 "hfov": 360,
 "partial": false,
 "id": "panorama_2669CA02_2C3F_CFCF_41C1_E694A5B56234",
 "label": "IMG_20220316_110812_00_350",
 "pitch": 0,
 "hfovMax": 130,
 "class": "Panorama",
 "vfov": 180,
 "frames": [
  {
   "front": {
    "levels": [
     {
      "url": "media/panorama_2669CA02_2C3F_CFCF_41C1_E694A5B56234_0/f/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "width": 2048,
      "colCount": 4,
      "height": 2048,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_2669CA02_2C3F_CFCF_41C1_E694A5B56234_0/f/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2,
      "height": 1024,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_2669CA02_2C3F_CFCF_41C1_E694A5B56234_0/f/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ]
     }
    ],
    "class": "ImageResource"
   },
   "top": {
    "levels": [
     {
      "url": "media/panorama_2669CA02_2C3F_CFCF_41C1_E694A5B56234_0/u/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "width": 2048,
      "colCount": 4,
      "height": 2048,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_2669CA02_2C3F_CFCF_41C1_E694A5B56234_0/u/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2,
      "height": 1024,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_2669CA02_2C3F_CFCF_41C1_E694A5B56234_0/u/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ]
     }
    ],
    "class": "ImageResource"
   },
   "right": {
    "levels": [
     {
      "url": "media/panorama_2669CA02_2C3F_CFCF_41C1_E694A5B56234_0/r/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "width": 2048,
      "colCount": 4,
      "height": 2048,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_2669CA02_2C3F_CFCF_41C1_E694A5B56234_0/r/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2,
      "height": 1024,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_2669CA02_2C3F_CFCF_41C1_E694A5B56234_0/r/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ]
     }
    ],
    "class": "ImageResource"
   },
   "back": {
    "levels": [
     {
      "url": "media/panorama_2669CA02_2C3F_CFCF_41C1_E694A5B56234_0/b/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "width": 2048,
      "colCount": 4,
      "height": 2048,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_2669CA02_2C3F_CFCF_41C1_E694A5B56234_0/b/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2,
      "height": 1024,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_2669CA02_2C3F_CFCF_41C1_E694A5B56234_0/b/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ]
     }
    ],
    "class": "ImageResource"
   },
   "bottom": {
    "levels": [
     {
      "url": "media/panorama_2669CA02_2C3F_CFCF_41C1_E694A5B56234_0/d/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "width": 2048,
      "colCount": 4,
      "height": 2048,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_2669CA02_2C3F_CFCF_41C1_E694A5B56234_0/d/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2,
      "height": 1024,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_2669CA02_2C3F_CFCF_41C1_E694A5B56234_0/d/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ]
     }
    ],
    "class": "ImageResource"
   },
   "left": {
    "levels": [
     {
      "url": "media/panorama_2669CA02_2C3F_CFCF_41C1_E694A5B56234_0/l/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "width": 2048,
      "colCount": 4,
      "height": 2048,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_2669CA02_2C3F_CFCF_41C1_E694A5B56234_0/l/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2,
      "height": 1024,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_2669CA02_2C3F_CFCF_41C1_E694A5B56234_0/l/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ]
     }
    ],
    "class": "ImageResource"
   },
   "class": "CubicPanoramaFrame",
   "thumbnailUrl": "media/panorama_2669CA02_2C3F_CFCF_41C1_E694A5B56234_t.jpg"
  }
 ],
 "hfovMin": "135%",
 "overlays": [
  "this.overlay_77C5A122_606C_B0AE_419B_1B84BF107EAD",
  "this.overlay_789F1C42_606D_F0F3_41D3_3C5803B683A4",
  "this.overlay_780D84AA_606C_F1BE_41CF_970A615CDADB",
  "this.overlay_7957508A_606F_907E_41A3_C53DE2084BDE",
  "this.panorama_2669CA02_2C3F_CFCF_41C1_E694A5B56234_tcap0"
 ]
},
{
 "adjacentPanoramas": [
  {
   "yaw": 102.75,
   "backwardYaw": -95.75,
   "distance": 1,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_26666712_2C3C_C5CF_4198_822E2A8C8DCC"
  },
  {
   "yaw": -75.13,
   "backwardYaw": -102.25,
   "distance": 1,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_266A48C5_2C3C_4C55_41B3_1D70C2050903"
  }
 ],
 "thumbnailUrl": "media/panorama_264C2F16_2C3C_C5F7_41C0_5EA2911E8144_t.jpg",
 "hfov": 360,
 "partial": false,
 "id": "panorama_264C2F16_2C3C_C5F7_41C0_5EA2911E8144",
 "label": "IMG_20220316_115056_00_371",
 "pitch": 0,
 "hfovMax": 130,
 "class": "Panorama",
 "vfov": 180,
 "frames": [
  {
   "front": {
    "levels": [
     {
      "url": "media/panorama_264C2F16_2C3C_C5F7_41C0_5EA2911E8144_0/f/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "width": 2048,
      "colCount": 4,
      "height": 2048,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_264C2F16_2C3C_C5F7_41C0_5EA2911E8144_0/f/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2,
      "height": 1024,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_264C2F16_2C3C_C5F7_41C0_5EA2911E8144_0/f/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ]
     }
    ],
    "class": "ImageResource"
   },
   "top": {
    "levels": [
     {
      "url": "media/panorama_264C2F16_2C3C_C5F7_41C0_5EA2911E8144_0/u/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "width": 2048,
      "colCount": 4,
      "height": 2048,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_264C2F16_2C3C_C5F7_41C0_5EA2911E8144_0/u/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2,
      "height": 1024,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_264C2F16_2C3C_C5F7_41C0_5EA2911E8144_0/u/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ]
     }
    ],
    "class": "ImageResource"
   },
   "right": {
    "levels": [
     {
      "url": "media/panorama_264C2F16_2C3C_C5F7_41C0_5EA2911E8144_0/r/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "width": 2048,
      "colCount": 4,
      "height": 2048,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_264C2F16_2C3C_C5F7_41C0_5EA2911E8144_0/r/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2,
      "height": 1024,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_264C2F16_2C3C_C5F7_41C0_5EA2911E8144_0/r/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ]
     }
    ],
    "class": "ImageResource"
   },
   "back": {
    "levels": [
     {
      "url": "media/panorama_264C2F16_2C3C_C5F7_41C0_5EA2911E8144_0/b/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "width": 2048,
      "colCount": 4,
      "height": 2048,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_264C2F16_2C3C_C5F7_41C0_5EA2911E8144_0/b/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2,
      "height": 1024,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_264C2F16_2C3C_C5F7_41C0_5EA2911E8144_0/b/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ]
     }
    ],
    "class": "ImageResource"
   },
   "bottom": {
    "levels": [
     {
      "url": "media/panorama_264C2F16_2C3C_C5F7_41C0_5EA2911E8144_0/d/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "width": 2048,
      "colCount": 4,
      "height": 2048,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_264C2F16_2C3C_C5F7_41C0_5EA2911E8144_0/d/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2,
      "height": 1024,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_264C2F16_2C3C_C5F7_41C0_5EA2911E8144_0/d/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ]
     }
    ],
    "class": "ImageResource"
   },
   "left": {
    "levels": [
     {
      "url": "media/panorama_264C2F16_2C3C_C5F7_41C0_5EA2911E8144_0/l/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "width": 2048,
      "colCount": 4,
      "height": 2048,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_264C2F16_2C3C_C5F7_41C0_5EA2911E8144_0/l/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2,
      "height": 1024,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_264C2F16_2C3C_C5F7_41C0_5EA2911E8144_0/l/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ]
     }
    ],
    "class": "ImageResource"
   },
   "class": "CubicPanoramaFrame",
   "thumbnailUrl": "media/panorama_264C2F16_2C3C_C5F7_41C0_5EA2911E8144_t.jpg"
  }
 ],
 "hfovMin": "135%",
 "overlays": [
  "this.panorama_264C2F16_2C3C_C5F7_41C0_5EA2911E8144_tcap0",
  "this.overlay_B2D2020B_AF09_DCF2_41CC_F3D904C35290",
  "this.overlay_B08DB96C_AF06_AF36_41D8_353B46FFCEC9",
  "this.overlay_B10B33C9_AF07_637E_41DB_E02F9769C8AA",
  "this.overlay_B119D3C8_AF07_A37E_41DB_558A3D4AE20C"
 ]
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ]
 },
 "id": "panorama_26661FEC_2C3C_C45B_419B_861471116CC7_camera"
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ]
 },
 "id": "panorama_2666F3DA_2C3C_BC7F_41A5_8719A461067F_camera"
},
{
 "adjacentPanoramas": [
  {
   "yaw": 128.12,
   "backwardYaw": 98.48,
   "distance": 1,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_26664293_2C3C_5CCD_41B6_BA5F5C9DBD4C"
  },
  {
   "yaw": -6.91,
   "backwardYaw": -101.87,
   "distance": 1,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_26667DFA_2C3C_443C_41B2_332913C8F61A"
  },
  {
   "yaw": -118.9,
   "backwardYaw": -14.57,
   "distance": 1,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_266A5334_2C3C_BDCB_41C0_5ECFC0F03DE9"
  }
 ],
 "thumbnailUrl": "media/panorama_266A40B1_2C3C_7CCD_41B2_B5FCEE869E17_t.jpg",
 "hfov": 360,
 "partial": false,
 "id": "panorama_266A40B1_2C3C_7CCD_41B2_B5FCEE869E17",
 "label": "IMG_20220316_105900_00_342",
 "pitch": 0,
 "hfovMax": 130,
 "class": "Panorama",
 "vfov": 180,
 "frames": [
  {
   "front": {
    "levels": [
     {
      "url": "media/panorama_266A40B1_2C3C_7CCD_41B2_B5FCEE869E17_0/f/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "width": 2048,
      "colCount": 4,
      "height": 2048,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_266A40B1_2C3C_7CCD_41B2_B5FCEE869E17_0/f/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2,
      "height": 1024,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_266A40B1_2C3C_7CCD_41B2_B5FCEE869E17_0/f/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ]
     }
    ],
    "class": "ImageResource"
   },
   "top": {
    "levels": [
     {
      "url": "media/panorama_266A40B1_2C3C_7CCD_41B2_B5FCEE869E17_0/u/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "width": 2048,
      "colCount": 4,
      "height": 2048,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_266A40B1_2C3C_7CCD_41B2_B5FCEE869E17_0/u/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2,
      "height": 1024,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_266A40B1_2C3C_7CCD_41B2_B5FCEE869E17_0/u/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ]
     }
    ],
    "class": "ImageResource"
   },
   "right": {
    "levels": [
     {
      "url": "media/panorama_266A40B1_2C3C_7CCD_41B2_B5FCEE869E17_0/r/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "width": 2048,
      "colCount": 4,
      "height": 2048,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_266A40B1_2C3C_7CCD_41B2_B5FCEE869E17_0/r/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2,
      "height": 1024,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_266A40B1_2C3C_7CCD_41B2_B5FCEE869E17_0/r/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ]
     }
    ],
    "class": "ImageResource"
   },
   "back": {
    "levels": [
     {
      "url": "media/panorama_266A40B1_2C3C_7CCD_41B2_B5FCEE869E17_0/b/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "width": 2048,
      "colCount": 4,
      "height": 2048,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_266A40B1_2C3C_7CCD_41B2_B5FCEE869E17_0/b/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2,
      "height": 1024,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_266A40B1_2C3C_7CCD_41B2_B5FCEE869E17_0/b/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ]
     }
    ],
    "class": "ImageResource"
   },
   "bottom": {
    "levels": [
     {
      "url": "media/panorama_266A40B1_2C3C_7CCD_41B2_B5FCEE869E17_0/d/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "width": 2048,
      "colCount": 4,
      "height": 2048,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_266A40B1_2C3C_7CCD_41B2_B5FCEE869E17_0/d/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2,
      "height": 1024,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_266A40B1_2C3C_7CCD_41B2_B5FCEE869E17_0/d/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ]
     }
    ],
    "class": "ImageResource"
   },
   "left": {
    "levels": [
     {
      "url": "media/panorama_266A40B1_2C3C_7CCD_41B2_B5FCEE869E17_0/l/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "width": 2048,
      "colCount": 4,
      "height": 2048,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_266A40B1_2C3C_7CCD_41B2_B5FCEE869E17_0/l/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2,
      "height": 1024,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_266A40B1_2C3C_7CCD_41B2_B5FCEE869E17_0/l/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ]
     }
    ],
    "class": "ImageResource"
   },
   "class": "CubicPanoramaFrame",
   "thumbnailUrl": "media/panorama_266A40B1_2C3C_7CCD_41B2_B5FCEE869E17_t.jpg"
  }
 ],
 "hfovMin": "135%",
 "overlays": [
  "this.overlay_46A4C62E_60E5_90B6_41B4_7DD93C87695C",
  "this.overlay_43EA9003_60E4_F06E_41B9_3472781FD72B",
  "this.overlay_431E5D7E_60E7_B096_41C2_9435EC9C8F59",
  "this.overlay_47343BB1_60E4_B7AA_41D0_02140CACE288",
  "this.overlay_44461386_60E5_9076_41CA_A2E18D515C9F",
  "this.overlay_448BA7A3_60E4_9FAE_41BC_344DA0D3FEC4",
  "this.panorama_266A40B1_2C3C_7CCD_41B2_B5FCEE869E17_tcap0"
 ]
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": 173.09,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ]
 },
 "id": "camera_86AAAE61_AF0B_652E_41E5_F418CE32601B"
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": 143.82,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ]
 },
 "id": "camera_86E51E2A_AF0B_6532_41DF_5F98FEDC432E"
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ]
 },
 "id": "panorama_266A5334_2C3C_BDCB_41C0_5ECFC0F03DE9_camera"
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": -81.27,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ]
 },
 "id": "camera_865A5EDF_AF0B_6512_41CD_9A46C109C6B6"
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": 46.85,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ]
 },
 "id": "camera_87C4CD23_AF0B_6732_41CD_839C86A94DA2"
},
{
 "adjacentPanoramas": [
  {
   "yaw": 63.94,
   "backwardYaw": 152.11,
   "distance": 1,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_2666CCAC_2C3C_C4D4_41B6_6F5BD1BACD46"
  },
  {
   "yaw": -77.63,
   "backwardYaw": 155.13,
   "distance": 1,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_266A2362_2C3C_7C4F_41C5_86D5259F47A8"
  }
 ],
 "thumbnailUrl": "media/panorama_266A5CEF_2C3C_4455_41A5_2CBA724838F2_t.jpg",
 "hfov": 360,
 "partial": false,
 "id": "panorama_266A5CEF_2C3C_4455_41A5_2CBA724838F2",
 "label": "IMG_20220316_104234_00_328",
 "pitch": 0,
 "hfovMax": 130,
 "class": "Panorama",
 "vfov": 180,
 "frames": [
  {
   "front": {
    "levels": [
     {
      "url": "media/panorama_266A5CEF_2C3C_4455_41A5_2CBA724838F2_0/f/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "width": 2048,
      "colCount": 4,
      "height": 2048,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_266A5CEF_2C3C_4455_41A5_2CBA724838F2_0/f/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2,
      "height": 1024,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_266A5CEF_2C3C_4455_41A5_2CBA724838F2_0/f/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ]
     }
    ],
    "class": "ImageResource"
   },
   "top": {
    "levels": [
     {
      "url": "media/panorama_266A5CEF_2C3C_4455_41A5_2CBA724838F2_0/u/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "width": 2048,
      "colCount": 4,
      "height": 2048,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_266A5CEF_2C3C_4455_41A5_2CBA724838F2_0/u/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2,
      "height": 1024,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_266A5CEF_2C3C_4455_41A5_2CBA724838F2_0/u/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ]
     }
    ],
    "class": "ImageResource"
   },
   "right": {
    "levels": [
     {
      "url": "media/panorama_266A5CEF_2C3C_4455_41A5_2CBA724838F2_0/r/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "width": 2048,
      "colCount": 4,
      "height": 2048,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_266A5CEF_2C3C_4455_41A5_2CBA724838F2_0/r/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2,
      "height": 1024,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_266A5CEF_2C3C_4455_41A5_2CBA724838F2_0/r/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ]
     }
    ],
    "class": "ImageResource"
   },
   "back": {
    "levels": [
     {
      "url": "media/panorama_266A5CEF_2C3C_4455_41A5_2CBA724838F2_0/b/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "width": 2048,
      "colCount": 4,
      "height": 2048,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_266A5CEF_2C3C_4455_41A5_2CBA724838F2_0/b/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2,
      "height": 1024,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_266A5CEF_2C3C_4455_41A5_2CBA724838F2_0/b/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ]
     }
    ],
    "class": "ImageResource"
   },
   "bottom": {
    "levels": [
     {
      "url": "media/panorama_266A5CEF_2C3C_4455_41A5_2CBA724838F2_0/d/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "width": 2048,
      "colCount": 4,
      "height": 2048,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_266A5CEF_2C3C_4455_41A5_2CBA724838F2_0/d/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2,
      "height": 1024,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_266A5CEF_2C3C_4455_41A5_2CBA724838F2_0/d/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ]
     }
    ],
    "class": "ImageResource"
   },
   "left": {
    "levels": [
     {
      "url": "media/panorama_266A5CEF_2C3C_4455_41A5_2CBA724838F2_0/l/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "width": 2048,
      "colCount": 4,
      "height": 2048,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_266A5CEF_2C3C_4455_41A5_2CBA724838F2_0/l/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2,
      "height": 1024,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_266A5CEF_2C3C_4455_41A5_2CBA724838F2_0/l/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ]
     }
    ],
    "class": "ImageResource"
   },
   "class": "CubicPanoramaFrame",
   "thumbnailUrl": "media/panorama_266A5CEF_2C3C_4455_41A5_2CBA724838F2_t.jpg"
  }
 ],
 "hfovMin": "135%",
 "overlays": [
  "this.overlay_20434678_2D8D_4417_41A9_DBA90D3AD6B0",
  "this.overlay_23043A42_2D8D_4C7B_4174_1B4EDA91EED8",
  "this.overlay_20588FD5_2D8E_C419_41C3_B545C5AECDE5",
  "this.overlay_2316226F_2D8F_FC09_419D_8EC53E2C2C51",
  "this.panorama_266A5CEF_2C3C_4455_41A5_2CBA724838F2_tcap0"
 ]
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ]
 },
 "id": "panorama_266AF94D_2C3C_CC54_4196_59CC1A2DCC79_camera"
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": 96.41,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ]
 },
 "id": "camera_869F8E9C_AF0B_6516_41A5_9E297CABCE99"
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ]
 },
 "id": "panorama_2669D8F8_2C3F_CC3B_41C4_43F82B11C465_camera"
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": -177.05,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ]
 },
 "id": "camera_87676D9B_AF0B_6712_41A7_DCEBED6419EB"
},
{
 "adjacentPanoramas": [
  {
   "yaw": 87.9,
   "backwardYaw": 1.85,
   "distance": 1,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_26661FEC_2C3C_C45B_419B_861471116CC7"
  },
  {
   "yaw": -95.75,
   "backwardYaw": 102.75,
   "distance": 1,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_264C2F16_2C3C_C5F7_41C0_5EA2911E8144"
  }
 ],
 "thumbnailUrl": "media/panorama_26666712_2C3C_C5CF_4198_822E2A8C8DCC_t.jpg",
 "hfov": 360,
 "partial": false,
 "id": "panorama_26666712_2C3C_C5CF_4198_822E2A8C8DCC",
 "label": "IMG_20220316_115239_00_374",
 "pitch": 0,
 "hfovMax": 130,
 "class": "Panorama",
 "vfov": 180,
 "frames": [
  {
   "front": {
    "levels": [
     {
      "url": "media/panorama_26666712_2C3C_C5CF_4198_822E2A8C8DCC_0/f/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "width": 2048,
      "colCount": 4,
      "height": 2048,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_26666712_2C3C_C5CF_4198_822E2A8C8DCC_0/f/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2,
      "height": 1024,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_26666712_2C3C_C5CF_4198_822E2A8C8DCC_0/f/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ]
     }
    ],
    "class": "ImageResource"
   },
   "top": {
    "levels": [
     {
      "url": "media/panorama_26666712_2C3C_C5CF_4198_822E2A8C8DCC_0/u/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "width": 2048,
      "colCount": 4,
      "height": 2048,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_26666712_2C3C_C5CF_4198_822E2A8C8DCC_0/u/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2,
      "height": 1024,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_26666712_2C3C_C5CF_4198_822E2A8C8DCC_0/u/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ]
     }
    ],
    "class": "ImageResource"
   },
   "right": {
    "levels": [
     {
      "url": "media/panorama_26666712_2C3C_C5CF_4198_822E2A8C8DCC_0/r/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "width": 2048,
      "colCount": 4,
      "height": 2048,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_26666712_2C3C_C5CF_4198_822E2A8C8DCC_0/r/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2,
      "height": 1024,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_26666712_2C3C_C5CF_4198_822E2A8C8DCC_0/r/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ]
     }
    ],
    "class": "ImageResource"
   },
   "back": {
    "levels": [
     {
      "url": "media/panorama_26666712_2C3C_C5CF_4198_822E2A8C8DCC_0/b/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "width": 2048,
      "colCount": 4,
      "height": 2048,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_26666712_2C3C_C5CF_4198_822E2A8C8DCC_0/b/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2,
      "height": 1024,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_26666712_2C3C_C5CF_4198_822E2A8C8DCC_0/b/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ]
     }
    ],
    "class": "ImageResource"
   },
   "bottom": {
    "levels": [
     {
      "url": "media/panorama_26666712_2C3C_C5CF_4198_822E2A8C8DCC_0/d/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "width": 2048,
      "colCount": 4,
      "height": 2048,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_26666712_2C3C_C5CF_4198_822E2A8C8DCC_0/d/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2,
      "height": 1024,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_26666712_2C3C_C5CF_4198_822E2A8C8DCC_0/d/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ]
     }
    ],
    "class": "ImageResource"
   },
   "left": {
    "levels": [
     {
      "url": "media/panorama_26666712_2C3C_C5CF_4198_822E2A8C8DCC_0/l/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "width": 2048,
      "colCount": 4,
      "height": 2048,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_26666712_2C3C_C5CF_4198_822E2A8C8DCC_0/l/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2,
      "height": 1024,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_26666712_2C3C_C5CF_4198_822E2A8C8DCC_0/l/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ]
     }
    ],
    "class": "ImageResource"
   },
   "class": "CubicPanoramaFrame",
   "thumbnailUrl": "media/panorama_26666712_2C3C_C5CF_4198_822E2A8C8DCC_t.jpg"
  }
 ],
 "hfovMin": "135%",
 "overlays": [
  "this.panorama_26666712_2C3C_C5CF_4198_822E2A8C8DCC_tcap0",
  "this.overlay_B233DDA2_AF7A_A732_41D4_E7A073FF3E26",
  "this.overlay_B040F2E1_AF79_5D2E_41DC_F81E4A90F044",
  "this.overlay_B1330DF1_AF79_E72E_419E_BE1869C61C7F",
  "this.overlay_8FD557DD_AF7E_A316_41DB_2827AEA0B947"
 ]
},
{
 "adjacentPanoramas": [
  {
   "yaw": -36.18,
   "backwardYaw": 145.46,
   "distance": 1,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_2666F3DA_2C3C_BC7F_41A5_8719A461067F"
  },
  {
   "yaw": 152.11,
   "backwardYaw": 63.94,
   "distance": 1,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_266A5CEF_2C3C_4455_41A5_2CBA724838F2"
  },
  {
   "yaw": -153.12,
   "backwardYaw": 63.94,
   "distance": 1,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_266A5CEF_2C3C_4455_41A5_2CBA724838F2"
  }
 ],
 "thumbnailUrl": "media/panorama_2666CCAC_2C3C_C4D4_41B6_6F5BD1BACD46_t.jpg",
 "hfov": 360,
 "partial": false,
 "id": "panorama_2666CCAC_2C3C_C4D4_41B6_6F5BD1BACD46",
 "label": "IMG_20220316_113233_00_366",
 "pitch": 0,
 "hfovMax": 130,
 "class": "Panorama",
 "vfov": 180,
 "frames": [
  {
   "front": {
    "levels": [
     {
      "url": "media/panorama_2666CCAC_2C3C_C4D4_41B6_6F5BD1BACD46_0/f/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "width": 2048,
      "colCount": 4,
      "height": 2048,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_2666CCAC_2C3C_C4D4_41B6_6F5BD1BACD46_0/f/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2,
      "height": 1024,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_2666CCAC_2C3C_C4D4_41B6_6F5BD1BACD46_0/f/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ]
     }
    ],
    "class": "ImageResource"
   },
   "top": {
    "levels": [
     {
      "url": "media/panorama_2666CCAC_2C3C_C4D4_41B6_6F5BD1BACD46_0/u/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "width": 2048,
      "colCount": 4,
      "height": 2048,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_2666CCAC_2C3C_C4D4_41B6_6F5BD1BACD46_0/u/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2,
      "height": 1024,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_2666CCAC_2C3C_C4D4_41B6_6F5BD1BACD46_0/u/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ]
     }
    ],
    "class": "ImageResource"
   },
   "right": {
    "levels": [
     {
      "url": "media/panorama_2666CCAC_2C3C_C4D4_41B6_6F5BD1BACD46_0/r/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "width": 2048,
      "colCount": 4,
      "height": 2048,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_2666CCAC_2C3C_C4D4_41B6_6F5BD1BACD46_0/r/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2,
      "height": 1024,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_2666CCAC_2C3C_C4D4_41B6_6F5BD1BACD46_0/r/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ]
     }
    ],
    "class": "ImageResource"
   },
   "back": {
    "levels": [
     {
      "url": "media/panorama_2666CCAC_2C3C_C4D4_41B6_6F5BD1BACD46_0/b/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "width": 2048,
      "colCount": 4,
      "height": 2048,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_2666CCAC_2C3C_C4D4_41B6_6F5BD1BACD46_0/b/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2,
      "height": 1024,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_2666CCAC_2C3C_C4D4_41B6_6F5BD1BACD46_0/b/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ]
     }
    ],
    "class": "ImageResource"
   },
   "bottom": {
    "levels": [
     {
      "url": "media/panorama_2666CCAC_2C3C_C4D4_41B6_6F5BD1BACD46_0/d/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "width": 2048,
      "colCount": 4,
      "height": 2048,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_2666CCAC_2C3C_C4D4_41B6_6F5BD1BACD46_0/d/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2,
      "height": 1024,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_2666CCAC_2C3C_C4D4_41B6_6F5BD1BACD46_0/d/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ]
     }
    ],
    "class": "ImageResource"
   },
   "left": {
    "levels": [
     {
      "url": "media/panorama_2666CCAC_2C3C_C4D4_41B6_6F5BD1BACD46_0/l/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "width": 2048,
      "colCount": 4,
      "height": 2048,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_2666CCAC_2C3C_C4D4_41B6_6F5BD1BACD46_0/l/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2,
      "height": 1024,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_2666CCAC_2C3C_C4D4_41B6_6F5BD1BACD46_0/l/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ]
     }
    ],
    "class": "ImageResource"
   },
   "class": "CubicPanoramaFrame",
   "thumbnailUrl": "media/panorama_2666CCAC_2C3C_C4D4_41B6_6F5BD1BACD46_t.jpg"
  }
 ],
 "hfovMin": "135%",
 "overlays": [
  "this.overlay_3B0A1B1C_2D9B_4C0F_41B6_BA4B76E85157",
  "this.overlay_3A6B540B_2D9A_C409_41C5_5D5C8307B813",
  "this.overlay_3A53ABE4_2D85_4C3F_41BA_BE5382E75734",
  "this.overlay_380F7561_2D85_4439_41BF_A81BAF51F55A",
  "this.overlay_3ADB1F31_2DBB_4419_41B4_423AAF3487DE",
  "this.panorama_2666CCAC_2C3C_C4D4_41B6_6F5BD1BACD46_tcap0"
 ]
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ]
 },
 "id": "panorama_266ACD16_2C3C_C5F4_41C4_48EB0653785E_camera"
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": -116.06,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ]
 },
 "id": "camera_85BA5BC9_AF0B_637E_41D4_CDFFEF9EEC4A"
},
{
 "adjacentPanoramas": [
  {
   "yaw": 143.57,
   "backwardYaw": -36.77,
   "distance": 1,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_2666F3DA_2C3C_BC7F_41A5_8719A461067F"
  },
  {
   "yaw": -153.5,
   "backwardYaw": -36.77,
   "distance": 1,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_2666F3DA_2C3C_BC7F_41A5_8719A461067F"
  },
  {
   "yaw": -32.41,
   "backwardYaw": -54.14,
   "distance": 1,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_26664293_2C3C_5CCD_41B6_BA5F5C9DBD4C"
  }
 ],
 "thumbnailUrl": "media/panorama_26663B80_2C3C_4CCC_41C4_05539F545C2A_t.jpg",
 "hfov": 360,
 "partial": false,
 "id": "panorama_26663B80_2C3C_4CCC_41C4_05539F545C2A",
 "label": "IMG_20220316_112940_00_364",
 "pitch": 0,
 "hfovMax": 130,
 "class": "Panorama",
 "vfov": 180,
 "frames": [
  {
   "front": {
    "levels": [
     {
      "url": "media/panorama_26663B80_2C3C_4CCC_41C4_05539F545C2A_0/f/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "width": 2048,
      "colCount": 4,
      "height": 2048,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_26663B80_2C3C_4CCC_41C4_05539F545C2A_0/f/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2,
      "height": 1024,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_26663B80_2C3C_4CCC_41C4_05539F545C2A_0/f/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ]
     }
    ],
    "class": "ImageResource"
   },
   "top": {
    "levels": [
     {
      "url": "media/panorama_26663B80_2C3C_4CCC_41C4_05539F545C2A_0/u/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "width": 2048,
      "colCount": 4,
      "height": 2048,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_26663B80_2C3C_4CCC_41C4_05539F545C2A_0/u/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2,
      "height": 1024,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_26663B80_2C3C_4CCC_41C4_05539F545C2A_0/u/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ]
     }
    ],
    "class": "ImageResource"
   },
   "right": {
    "levels": [
     {
      "url": "media/panorama_26663B80_2C3C_4CCC_41C4_05539F545C2A_0/r/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "width": 2048,
      "colCount": 4,
      "height": 2048,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_26663B80_2C3C_4CCC_41C4_05539F545C2A_0/r/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2,
      "height": 1024,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_26663B80_2C3C_4CCC_41C4_05539F545C2A_0/r/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ]
     }
    ],
    "class": "ImageResource"
   },
   "back": {
    "levels": [
     {
      "url": "media/panorama_26663B80_2C3C_4CCC_41C4_05539F545C2A_0/b/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "width": 2048,
      "colCount": 4,
      "height": 2048,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_26663B80_2C3C_4CCC_41C4_05539F545C2A_0/b/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2,
      "height": 1024,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_26663B80_2C3C_4CCC_41C4_05539F545C2A_0/b/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ]
     }
    ],
    "class": "ImageResource"
   },
   "bottom": {
    "levels": [
     {
      "url": "media/panorama_26663B80_2C3C_4CCC_41C4_05539F545C2A_0/d/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "width": 2048,
      "colCount": 4,
      "height": 2048,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_26663B80_2C3C_4CCC_41C4_05539F545C2A_0/d/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2,
      "height": 1024,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_26663B80_2C3C_4CCC_41C4_05539F545C2A_0/d/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ]
     }
    ],
    "class": "ImageResource"
   },
   "left": {
    "levels": [
     {
      "url": "media/panorama_26663B80_2C3C_4CCC_41C4_05539F545C2A_0/l/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "width": 2048,
      "colCount": 4,
      "height": 2048,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_26663B80_2C3C_4CCC_41C4_05539F545C2A_0/l/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2,
      "height": 1024,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_26663B80_2C3C_4CCC_41C4_05539F545C2A_0/l/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ]
     }
    ],
    "class": "ImageResource"
   },
   "class": "CubicPanoramaFrame",
   "thumbnailUrl": "media/panorama_26663B80_2C3C_4CCC_41C4_05539F545C2A_t.jpg"
  }
 ],
 "hfovMin": "135%",
 "overlays": [
  "this.overlay_41F0651D_5579_A9CE_41C6_3BE692E0E12F",
  "this.overlay_40916CFE_557E_F84B_419C_21FDD14CE415",
  "this.overlay_40432C84_557E_58BF_41C0_FA122CEE6020",
  "this.overlay_40102A2C_557E_FBCF_41CC_1B1081E8E959",
  "this.overlay_4193CB30_5579_B9D6_4193_292EAD704596",
  "this.panorama_26663B80_2C3C_4CCC_41C4_05539F545C2A_tcap0"
 ]
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ]
 },
 "id": "panorama_264C2F16_2C3C_C5F7_41C0_5EA2911E8144_camera"
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ]
 },
 "id": "panorama_266659AF_2C3C_4CD5_41A2_2211D54F0994_camera"
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": -162.76,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ]
 },
 "id": "camera_86C5FE4B_AF0B_6572_41DE_DDF7F8203E04"
},
{
 "adjacentPanoramas": [
  {
   "yaw": -75.49,
   "backwardYaw": 86.67,
   "distance": 1,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_266ACD16_2C3C_C5F4_41C4_48EB0653785E"
  },
  {
   "yaw": 98.98,
   "backwardYaw": 2.95,
   "distance": 1,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_266ABC73_2C3C_444D_41A2_D12FEAAC1356"
  }
 ],
 "thumbnailUrl": "media/panorama_266A36EB_2C3C_C45D_41A9_B83C69110285_t.jpg",
 "hfov": 360,
 "partial": false,
 "id": "panorama_266A36EB_2C3C_C45D_41A9_B83C69110285",
 "label": "IMG_20220316_105240_00_336",
 "pitch": 0,
 "hfovMax": 130,
 "class": "Panorama",
 "vfov": 180,
 "frames": [
  {
   "front": {
    "levels": [
     {
      "url": "media/panorama_266A36EB_2C3C_C45D_41A9_B83C69110285_0/f/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "width": 2048,
      "colCount": 4,
      "height": 2048,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_266A36EB_2C3C_C45D_41A9_B83C69110285_0/f/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2,
      "height": 1024,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_266A36EB_2C3C_C45D_41A9_B83C69110285_0/f/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ]
     }
    ],
    "class": "ImageResource"
   },
   "top": {
    "levels": [
     {
      "url": "media/panorama_266A36EB_2C3C_C45D_41A9_B83C69110285_0/u/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "width": 2048,
      "colCount": 4,
      "height": 2048,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_266A36EB_2C3C_C45D_41A9_B83C69110285_0/u/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2,
      "height": 1024,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_266A36EB_2C3C_C45D_41A9_B83C69110285_0/u/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ]
     }
    ],
    "class": "ImageResource"
   },
   "right": {
    "levels": [
     {
      "url": "media/panorama_266A36EB_2C3C_C45D_41A9_B83C69110285_0/r/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "width": 2048,
      "colCount": 4,
      "height": 2048,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_266A36EB_2C3C_C45D_41A9_B83C69110285_0/r/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2,
      "height": 1024,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_266A36EB_2C3C_C45D_41A9_B83C69110285_0/r/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ]
     }
    ],
    "class": "ImageResource"
   },
   "back": {
    "levels": [
     {
      "url": "media/panorama_266A36EB_2C3C_C45D_41A9_B83C69110285_0/b/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "width": 2048,
      "colCount": 4,
      "height": 2048,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_266A36EB_2C3C_C45D_41A9_B83C69110285_0/b/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2,
      "height": 1024,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_266A36EB_2C3C_C45D_41A9_B83C69110285_0/b/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ]
     }
    ],
    "class": "ImageResource"
   },
   "bottom": {
    "levels": [
     {
      "url": "media/panorama_266A36EB_2C3C_C45D_41A9_B83C69110285_0/d/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "width": 2048,
      "colCount": 4,
      "height": 2048,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_266A36EB_2C3C_C45D_41A9_B83C69110285_0/d/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2,
      "height": 1024,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_266A36EB_2C3C_C45D_41A9_B83C69110285_0/d/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ]
     }
    ],
    "class": "ImageResource"
   },
   "left": {
    "levels": [
     {
      "url": "media/panorama_266A36EB_2C3C_C45D_41A9_B83C69110285_0/l/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "width": 2048,
      "colCount": 4,
      "height": 2048,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_266A36EB_2C3C_C45D_41A9_B83C69110285_0/l/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2,
      "height": 1024,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_266A36EB_2C3C_C45D_41A9_B83C69110285_0/l/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ]
     }
    ],
    "class": "ImageResource"
   },
   "class": "CubicPanoramaFrame",
   "thumbnailUrl": "media/panorama_266A36EB_2C3C_C45D_41A9_B83C69110285_t.jpg"
  }
 ],
 "hfovMin": "135%",
 "overlays": [
  "this.panorama_266A36EB_2C3C_C45D_41A9_B83C69110285_tcap0",
  "this.overlay_B4554F1F_AF06_E312_41D7_00F88FED45E6",
  "this.overlay_B34CEF41_AF07_636E_41E2_6AD7F70D317F",
  "this.overlay_B0892951_AF07_6F6E_41C1_721BC4BF481C",
  "this.overlay_B3AE81A4_AF06_BF36_41E2_A6D19C63A480"
 ]
},
{
 "adjacentPanoramas": [
  {
   "yaw": 139.68,
   "backwardYaw": -83.59,
   "distance": 1,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_266ACD16_2C3C_C5F4_41C4_48EB0653785E"
  },
  {
   "yaw": -146.46,
   "backwardYaw": -83.59,
   "distance": 1,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_266ACD16_2C3C_C5F4_41C4_48EB0653785E"
  }
 ],
 "thumbnailUrl": "media/panorama_266AF94D_2C3C_CC54_4196_59CC1A2DCC79_t.jpg",
 "hfov": 360,
 "partial": false,
 "id": "panorama_266AF94D_2C3C_CC54_4196_59CC1A2DCC79",
 "label": "IMG_20220316_104916_00_331",
 "pitch": 0,
 "hfovMax": 130,
 "class": "Panorama",
 "vfov": 180,
 "frames": [
  {
   "front": {
    "levels": [
     {
      "url": "media/panorama_266AF94D_2C3C_CC54_4196_59CC1A2DCC79_0/f/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "width": 2048,
      "colCount": 4,
      "height": 2048,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_266AF94D_2C3C_CC54_4196_59CC1A2DCC79_0/f/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2,
      "height": 1024,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_266AF94D_2C3C_CC54_4196_59CC1A2DCC79_0/f/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ]
     }
    ],
    "class": "ImageResource"
   },
   "top": {
    "levels": [
     {
      "url": "media/panorama_266AF94D_2C3C_CC54_4196_59CC1A2DCC79_0/u/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "width": 2048,
      "colCount": 4,
      "height": 2048,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_266AF94D_2C3C_CC54_4196_59CC1A2DCC79_0/u/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2,
      "height": 1024,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_266AF94D_2C3C_CC54_4196_59CC1A2DCC79_0/u/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ]
     }
    ],
    "class": "ImageResource"
   },
   "right": {
    "levels": [
     {
      "url": "media/panorama_266AF94D_2C3C_CC54_4196_59CC1A2DCC79_0/r/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "width": 2048,
      "colCount": 4,
      "height": 2048,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_266AF94D_2C3C_CC54_4196_59CC1A2DCC79_0/r/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2,
      "height": 1024,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_266AF94D_2C3C_CC54_4196_59CC1A2DCC79_0/r/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ]
     }
    ],
    "class": "ImageResource"
   },
   "back": {
    "levels": [
     {
      "url": "media/panorama_266AF94D_2C3C_CC54_4196_59CC1A2DCC79_0/b/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "width": 2048,
      "colCount": 4,
      "height": 2048,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_266AF94D_2C3C_CC54_4196_59CC1A2DCC79_0/b/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2,
      "height": 1024,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_266AF94D_2C3C_CC54_4196_59CC1A2DCC79_0/b/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ]
     }
    ],
    "class": "ImageResource"
   },
   "bottom": {
    "levels": [
     {
      "url": "media/panorama_266AF94D_2C3C_CC54_4196_59CC1A2DCC79_0/d/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "width": 2048,
      "colCount": 4,
      "height": 2048,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_266AF94D_2C3C_CC54_4196_59CC1A2DCC79_0/d/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2,
      "height": 1024,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_266AF94D_2C3C_CC54_4196_59CC1A2DCC79_0/d/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ]
     }
    ],
    "class": "ImageResource"
   },
   "left": {
    "levels": [
     {
      "url": "media/panorama_266AF94D_2C3C_CC54_4196_59CC1A2DCC79_0/l/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "width": 2048,
      "colCount": 4,
      "height": 2048,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_266AF94D_2C3C_CC54_4196_59CC1A2DCC79_0/l/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2,
      "height": 1024,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_266AF94D_2C3C_CC54_4196_59CC1A2DCC79_0/l/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ]
     }
    ],
    "class": "ImageResource"
   },
   "class": "CubicPanoramaFrame",
   "thumbnailUrl": "media/panorama_266AF94D_2C3C_CC54_4196_59CC1A2DCC79_t.jpg"
  }
 ],
 "hfovMin": "135%",
 "overlays": [
  "this.panorama_266AF94D_2C3C_CC54_4196_59CC1A2DCC79_tcap0",
  "this.overlay_B2EBE8B7_AF3A_AD12_41DD_7547A38EDAE2",
  "this.overlay_B1F25BEB_AF3A_E332_41DC_0B2C98BE4D9E",
  "this.overlay_B2209828_AF1E_ED3E_41E5_72D7D87A80BE"
 ]
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": 111.16,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ]
 },
 "id": "camera_85BCAF61_AF0B_632E_41DE_3B66FC1DCF79"
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": 105.19,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ]
 },
 "id": "camera_8800CC9D_AF0B_6516_41E5_552A1BEB3C43"
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": -48.47,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ]
 },
 "id": "camera_87E50CF0_AF0B_652E_41D5_F890DCC75595"
},
{
 "adjacentPanoramas": [
  {
   "yaw": 131.53,
   "backwardYaw": 104.63,
   "distance": 1,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_266659AF_2C3C_4CD5_41A2_2211D54F0994"
  },
  {
   "yaw": -162.04,
   "backwardYaw": 104.63,
   "distance": 1,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_266659AF_2C3C_4CD5_41A2_2211D54F0994"
  }
 ],
 "thumbnailUrl": "media/panorama_2669CEC5_2C3F_C455_41C1_4FFEA2873441_t.jpg",
 "hfov": 360,
 "partial": false,
 "id": "panorama_2669CEC5_2C3F_C455_41C1_4FFEA2873441",
 "label": "IMG_20220316_111452_00_357",
 "pitch": 0,
 "hfovMax": 130,
 "class": "Panorama",
 "vfov": 180,
 "frames": [
  {
   "front": {
    "levels": [
     {
      "url": "media/panorama_2669CEC5_2C3F_C455_41C1_4FFEA2873441_0/f/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "width": 2048,
      "colCount": 4,
      "height": 2048,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_2669CEC5_2C3F_C455_41C1_4FFEA2873441_0/f/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2,
      "height": 1024,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_2669CEC5_2C3F_C455_41C1_4FFEA2873441_0/f/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ]
     }
    ],
    "class": "ImageResource"
   },
   "top": {
    "levels": [
     {
      "url": "media/panorama_2669CEC5_2C3F_C455_41C1_4FFEA2873441_0/u/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "width": 2048,
      "colCount": 4,
      "height": 2048,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_2669CEC5_2C3F_C455_41C1_4FFEA2873441_0/u/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2,
      "height": 1024,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_2669CEC5_2C3F_C455_41C1_4FFEA2873441_0/u/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ]
     }
    ],
    "class": "ImageResource"
   },
   "right": {
    "levels": [
     {
      "url": "media/panorama_2669CEC5_2C3F_C455_41C1_4FFEA2873441_0/r/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "width": 2048,
      "colCount": 4,
      "height": 2048,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_2669CEC5_2C3F_C455_41C1_4FFEA2873441_0/r/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2,
      "height": 1024,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_2669CEC5_2C3F_C455_41C1_4FFEA2873441_0/r/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ]
     }
    ],
    "class": "ImageResource"
   },
   "back": {
    "levels": [
     {
      "url": "media/panorama_2669CEC5_2C3F_C455_41C1_4FFEA2873441_0/b/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "width": 2048,
      "colCount": 4,
      "height": 2048,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_2669CEC5_2C3F_C455_41C1_4FFEA2873441_0/b/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2,
      "height": 1024,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_2669CEC5_2C3F_C455_41C1_4FFEA2873441_0/b/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ]
     }
    ],
    "class": "ImageResource"
   },
   "bottom": {
    "levels": [
     {
      "url": "media/panorama_2669CEC5_2C3F_C455_41C1_4FFEA2873441_0/d/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "width": 2048,
      "colCount": 4,
      "height": 2048,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_2669CEC5_2C3F_C455_41C1_4FFEA2873441_0/d/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2,
      "height": 1024,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_2669CEC5_2C3F_C455_41C1_4FFEA2873441_0/d/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ]
     }
    ],
    "class": "ImageResource"
   },
   "left": {
    "levels": [
     {
      "url": "media/panorama_2669CEC5_2C3F_C455_41C1_4FFEA2873441_0/l/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "width": 2048,
      "colCount": 4,
      "height": 2048,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_2669CEC5_2C3F_C455_41C1_4FFEA2873441_0/l/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2,
      "height": 1024,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_2669CEC5_2C3F_C455_41C1_4FFEA2873441_0/l/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ]
     }
    ],
    "class": "ImageResource"
   },
   "class": "CubicPanoramaFrame",
   "thumbnailUrl": "media/panorama_2669CEC5_2C3F_C455_41C1_4FFEA2873441_t.jpg"
  }
 ],
 "hfovMin": "135%",
 "overlays": [
  "this.panorama_2669CEC5_2C3F_C455_41C1_4FFEA2873441_tcap0",
  "this.overlay_8C077ED2_AF0A_A512_41D8_253DB37FD2F7",
  "this.overlay_89EEF742_AF0E_A372_41D0_C23866529BBC",
  "this.overlay_8BDEE56C_AF06_A735_41E0_9372F3597583"
 ]
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ]
 },
 "id": "panorama_266A7DB6_2C3C_4437_41C1_235AEE268532_camera"
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": -92.1,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ]
 },
 "id": "camera_878C1D64_AF0B_6736_41D1_562EE355EF7F"
},
{
 "adjacentPanoramas": [
  {
   "yaw": 86.67,
   "backwardYaw": -75.49,
   "distance": 1,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_266A36EB_2C3C_C45D_41A9_B83C69110285"
  },
  {
   "yaw": -83.59,
   "backwardYaw": 139.68,
   "distance": 1,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_266AF94D_2C3C_CC54_4196_59CC1A2DCC79"
  }
 ],
 "thumbnailUrl": "media/panorama_266ACD16_2C3C_C5F4_41C4_48EB0653785E_t.jpg",
 "hfov": 360,
 "partial": false,
 "id": "panorama_266ACD16_2C3C_C5F4_41C4_48EB0653785E",
 "label": "IMG_20220316_105009_00_332",
 "pitch": 0,
 "hfovMax": 130,
 "class": "Panorama",
 "vfov": 180,
 "frames": [
  {
   "front": {
    "levels": [
     {
      "url": "media/panorama_266ACD16_2C3C_C5F4_41C4_48EB0653785E_0/f/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "width": 2048,
      "colCount": 4,
      "height": 2048,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_266ACD16_2C3C_C5F4_41C4_48EB0653785E_0/f/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2,
      "height": 1024,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_266ACD16_2C3C_C5F4_41C4_48EB0653785E_0/f/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ]
     }
    ],
    "class": "ImageResource"
   },
   "top": {
    "levels": [
     {
      "url": "media/panorama_266ACD16_2C3C_C5F4_41C4_48EB0653785E_0/u/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "width": 2048,
      "colCount": 4,
      "height": 2048,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_266ACD16_2C3C_C5F4_41C4_48EB0653785E_0/u/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2,
      "height": 1024,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_266ACD16_2C3C_C5F4_41C4_48EB0653785E_0/u/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ]
     }
    ],
    "class": "ImageResource"
   },
   "right": {
    "levels": [
     {
      "url": "media/panorama_266ACD16_2C3C_C5F4_41C4_48EB0653785E_0/r/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "width": 2048,
      "colCount": 4,
      "height": 2048,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_266ACD16_2C3C_C5F4_41C4_48EB0653785E_0/r/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2,
      "height": 1024,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_266ACD16_2C3C_C5F4_41C4_48EB0653785E_0/r/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ]
     }
    ],
    "class": "ImageResource"
   },
   "back": {
    "levels": [
     {
      "url": "media/panorama_266ACD16_2C3C_C5F4_41C4_48EB0653785E_0/b/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "width": 2048,
      "colCount": 4,
      "height": 2048,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_266ACD16_2C3C_C5F4_41C4_48EB0653785E_0/b/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2,
      "height": 1024,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_266ACD16_2C3C_C5F4_41C4_48EB0653785E_0/b/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ]
     }
    ],
    "class": "ImageResource"
   },
   "bottom": {
    "levels": [
     {
      "url": "media/panorama_266ACD16_2C3C_C5F4_41C4_48EB0653785E_0/d/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "width": 2048,
      "colCount": 4,
      "height": 2048,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_266ACD16_2C3C_C5F4_41C4_48EB0653785E_0/d/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2,
      "height": 1024,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_266ACD16_2C3C_C5F4_41C4_48EB0653785E_0/d/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ]
     }
    ],
    "class": "ImageResource"
   },
   "left": {
    "levels": [
     {
      "url": "media/panorama_266ACD16_2C3C_C5F4_41C4_48EB0653785E_0/l/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "width": 2048,
      "colCount": 4,
      "height": 2048,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_266ACD16_2C3C_C5F4_41C4_48EB0653785E_0/l/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2,
      "height": 1024,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_266ACD16_2C3C_C5F4_41C4_48EB0653785E_0/l/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ]
     }
    ],
    "class": "ImageResource"
   },
   "class": "CubicPanoramaFrame",
   "thumbnailUrl": "media/panorama_266ACD16_2C3C_C5F4_41C4_48EB0653785E_t.jpg"
  }
 ],
 "hfovMin": "135%",
 "overlays": [
  "this.panorama_266ACD16_2C3C_C5F4_41C4_48EB0653785E_tcap0",
  "this.overlay_B32E8CC6_AF3F_A572_41DE_C26B94C38319",
  "this.overlay_B01EB080_AF3F_5DEE_41DD_BB31B9085012",
  "this.overlay_B24CEC14_AF39_6516_41E4_1A670E86B673",
  "this.overlay_B2593388_AF39_A3FE_41E4_AED1194C6BDD"
 ]
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": -46.1,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ]
 },
 "id": "camera_87F1BD05_AF0B_64F6_41D0_8C3AAB8F6CF3"
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": 61.1,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ]
 },
 "id": "camera_85865F84_AF0B_63F6_41E3_CC04EFB093B9"
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": 101.37,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ]
 },
 "id": "camera_85ED7F20_AF0B_632E_41E2_EDC4EAB024A0"
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ]
 },
 "id": "panorama_2669E37C_2C3F_DC3B_41AF_EA365FC497F6_camera"
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ]
 },
 "id": "panorama_2669CEC5_2C3F_C455_41C1_4FFEA2873441_camera"
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": -27.89,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ]
 },
 "id": "camera_87995D70_AF0B_672E_41AA_2B3636E50501"
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": -36.93,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ]
 },
 "id": "camera_85945F96_AF0B_6312_41CD_4A68AD96E5F9"
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": -81.02,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ]
 },
 "id": "camera_85F81F2B_AF0B_6332_41C5_8F53709957DE"
},
{
 "adjacentPanoramas": [
  {
   "yaw": -111.42,
   "backwardYaw": 125.99,
   "distance": 1,
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_274E4A2E_2C3D_CFD7_41C3_E749466BFD9F"
  }
 ],
 "thumbnailUrl": "media/panorama_2650731A_2C3C_7DFF_41BF_42020C9917DD_t.jpg",
 "hfov": 360,
 "partial": false,
 "id": "panorama_2650731A_2C3C_7DFF_41BF_42020C9917DD",
 "label": "IMG_20220316_122834_00_381",
 "pitch": 0,
 "hfovMax": 130,
 "class": "Panorama",
 "vfov": 180,
 "frames": [
  {
   "front": {
    "levels": [
     {
      "url": "media/panorama_2650731A_2C3C_7DFF_41BF_42020C9917DD_0/f/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "width": 2048,
      "colCount": 4,
      "height": 2048,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_2650731A_2C3C_7DFF_41BF_42020C9917DD_0/f/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2,
      "height": 1024,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_2650731A_2C3C_7DFF_41BF_42020C9917DD_0/f/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ]
     }
    ],
    "class": "ImageResource"
   },
   "top": {
    "levels": [
     {
      "url": "media/panorama_2650731A_2C3C_7DFF_41BF_42020C9917DD_0/u/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "width": 2048,
      "colCount": 4,
      "height": 2048,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_2650731A_2C3C_7DFF_41BF_42020C9917DD_0/u/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2,
      "height": 1024,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_2650731A_2C3C_7DFF_41BF_42020C9917DD_0/u/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ]
     }
    ],
    "class": "ImageResource"
   },
   "right": {
    "levels": [
     {
      "url": "media/panorama_2650731A_2C3C_7DFF_41BF_42020C9917DD_0/r/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "width": 2048,
      "colCount": 4,
      "height": 2048,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_2650731A_2C3C_7DFF_41BF_42020C9917DD_0/r/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2,
      "height": 1024,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_2650731A_2C3C_7DFF_41BF_42020C9917DD_0/r/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ]
     }
    ],
    "class": "ImageResource"
   },
   "back": {
    "levels": [
     {
      "url": "media/panorama_2650731A_2C3C_7DFF_41BF_42020C9917DD_0/b/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "width": 2048,
      "colCount": 4,
      "height": 2048,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_2650731A_2C3C_7DFF_41BF_42020C9917DD_0/b/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2,
      "height": 1024,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_2650731A_2C3C_7DFF_41BF_42020C9917DD_0/b/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ]
     }
    ],
    "class": "ImageResource"
   },
   "bottom": {
    "levels": [
     {
      "url": "media/panorama_2650731A_2C3C_7DFF_41BF_42020C9917DD_0/d/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "width": 2048,
      "colCount": 4,
      "height": 2048,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_2650731A_2C3C_7DFF_41BF_42020C9917DD_0/d/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2,
      "height": 1024,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_2650731A_2C3C_7DFF_41BF_42020C9917DD_0/d/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ]
     }
    ],
    "class": "ImageResource"
   },
   "left": {
    "levels": [
     {
      "url": "media/panorama_2650731A_2C3C_7DFF_41BF_42020C9917DD_0/l/0/{row}_{column}.jpg",
      "rowCount": 4,
      "class": "TiledImageResourceLevel",
      "width": 2048,
      "colCount": 4,
      "height": 2048,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_2650731A_2C3C_7DFF_41BF_42020C9917DD_0/l/1/{row}_{column}.jpg",
      "rowCount": 2,
      "class": "TiledImageResourceLevel",
      "width": 1024,
      "colCount": 2,
      "height": 1024,
      "tags": "ondemand"
     },
     {
      "url": "media/panorama_2650731A_2C3C_7DFF_41BF_42020C9917DD_0/l/2/{row}_{column}.jpg",
      "rowCount": 1,
      "class": "TiledImageResourceLevel",
      "width": 512,
      "colCount": 1,
      "height": 512,
      "tags": [
       "ondemand",
       "preload"
      ]
     }
    ],
    "class": "ImageResource"
   },
   "class": "CubicPanoramaFrame",
   "thumbnailUrl": "media/panorama_2650731A_2C3C_7DFF_41BF_42020C9917DD_t.jpg"
  }
 ],
 "hfovMin": "135%",
 "overlays": [
  "this.overlay_22835314_2C44_DDCB_41B6_140806259706",
  "this.overlay_22E12492_2C45_C4CC_41BF_444D79D5A280",
  "this.panorama_2650731A_2C3C_7DFF_41BF_42020C9917DD_tcap0"
 ]
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ]
 },
 "id": "panorama_266ABC73_2C3C_444D_41A2_D12FEAAC1356_camera"
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": 36.8,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ]
 },
 "id": "camera_87EF8CE6_AF0B_6532_41CE_B1DA45B039A6"
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": 143.23,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ]
 },
 "id": "camera_881DFCBD_AF0B_6516_41AB_591C6493915B"
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": -178.15,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ]
 },
 "id": "camera_858E6BDE_AF0B_6312_41D4_99D44647029B"
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": 0,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ]
 },
 "id": "panorama_266A2362_2C3C_7C4F_41C5_86D5259F47A8_camera"
},
{
 "automaticZoomSpeed": 10,
 "class": "PanoramaCamera",
 "initialPosition": {
  "yaw": -24.87,
  "class": "PanoramaCameraPosition",
  "pitch": 0
 },
 "initialSequence": {
  "restartMovementOnUserInteraction": false,
  "class": "PanoramaCameraSequence",
  "movements": [
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_in",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 323,
    "yawSpeed": 7.96,
    "easing": "linear",
    "class": "DistancePanoramaCameraMovement"
   },
   {
    "yawDelta": 18.5,
    "yawSpeed": 7.96,
    "easing": "cubic_out",
    "class": "DistancePanoramaCameraMovement"
   }
  ]
 },
 "id": "camera_8793BD7D_AF0B_6716_41D9_364FC54CE70E"
},
{
 "progressBarBorderColor": "#000000",
 "data": {
  "name": "Main Viewer"
 },
 "progressBackgroundColorDirection": "vertical",
 "id": "MainViewer",
 "playbackBarBottom": 5,
 "toolTipShadowSpread": 0,
 "progressBorderColor": "#000000",
 "progressBarBackgroundColorRatios": [
  0
 ],
 "toolTipBorderColor": "#767676",
 "paddingLeft": 0,
 "width": "100%",
 "playbackBarHeadOpacity": 1,
 "playbackBarProgressBackgroundColorDirection": "vertical",
 "progressBarBackgroundColor": [
  "#3399FF"
 ],
 "minWidth": 100,
 "minHeight": 50,
 "toolTipOpacity": 1,
 "progressBackgroundColor": [
  "#FFFFFF"
 ],
 "toolTipFontSize": "1.11vmin",
 "playbackBarHeadShadowHorizontalLength": 0,
 "playbackBarBackgroundColor": [
  "#FFFFFF"
 ],
 "playbackBarHeadWidth": 6,
 "toolTipShadowBlurRadius": 3,
 "playbackBarHeight": 10,
 "playbackBarBackgroundColorDirection": "vertical",
 "toolTipTextShadowColor": "#000000",
 "playbackBarRight": 0,
 "toolTipTextShadowBlurRadius": 3,
 "toolTipPaddingBottom": 4,
 "toolTipFontWeight": "normal",
 "playbackBarProgressBorderSize": 0,
 "playbackBarProgressBorderRadius": 0,
 "progressBarBorderRadius": 0,
 "progressBarBorderSize": 0,
 "height": "100%",
 "shadow": false,
 "toolTipShadowColor": "#333333",
 "playbackBarBorderRadius": 0,
 "playbackBarHeadBorderRadius": 0,
 "transitionMode": "blending",
 "playbackBarProgressBorderColor": "#000000",
 "paddingRight": 0,
 "toolTipShadowOpacity": 1,
 "progressLeft": 0,
 "playbackBarHeadBorderColor": "#000000",
 "playbackBarHeadBorderSize": 0,
 "playbackBarProgressOpacity": 1,
 "toolTipFontStyle": "normal",
 "playbackBarBorderSize": 0,
 "toolTipShadowHorizontalLength": 0,
 "propagateClick": false,
 "playbackBarBackgroundOpacity": 1,
 "toolTipFontFamily": "Arial",
 "toolTipShadowVerticalLength": 0,
 "vrPointerSelectionColor": "#FF6600",
 "toolTipTextShadowOpacity": 0,
 "playbackBarHeadBackgroundColor": [
  "#111111",
  "#666666"
 ],
 "playbackBarHeadShadowColor": "#000000",
 "vrPointerSelectionTime": 2000,
 "progressRight": 0,
 "firstTransitionDuration": 0,
 "progressOpacity": 1,
 "borderSize": 0,
 "progressBarBackgroundColorDirection": "vertical",
 "class": "ViewerArea",
 "playbackBarHeadShadow": true,
 "progressBottom": 0,
 "toolTipBackgroundColor": "#F6F6F6",
 "toolTipFontColor": "#606060",
 "playbackBarHeadBackgroundColorDirection": "vertical",
 "progressBackgroundOpacity": 1,
 "playbackBarProgressBackgroundColor": [
  "#3399FF"
 ],
 "playbackBarOpacity": 1,
 "progressHeight": 10,
 "displayTooltipInTouchScreens": true,
 "vrPointerColor": "#FFFFFF",
 "progressBarOpacity": 1,
 "playbackBarHeadShadowOpacity": 0.7,
 "playbackBarBorderColor": "#FFFFFF",
 "progressBorderSize": 0,
 "toolTipBorderSize": 1,
 "toolTipPaddingTop": 4,
 "toolTipPaddingLeft": 6,
 "progressBorderRadius": 0,
 "paddingBottom": 0,
 "toolTipDisplayTime": 600,
 "playbackBarProgressBackgroundColorRatios": [
  0
 ],
 "playbackBarLeft": 0,
 "toolTipPaddingRight": 6,
 "playbackBarHeadShadowVerticalLength": 0,
 "toolTipBorderRadius": 3,
 "borderRadius": 0,
 "playbackBarHeadShadowBlurRadius": 3,
 "progressBackgroundColorRatios": [
  0
 ],
 "paddingTop": 0,
 "playbackBarHeadBackgroundColorRatios": [
  0,
  1
 ],
 "transitionDuration": 500,
 "playbackBarHeadHeight": 15
},
{
 "transparencyActive": true,
 "propagateClick": true,
 "id": "IconButton_8890AD7C_AF3A_A716_41D7_D5ACF7CBB89B",
 "right": "0.97%",
 "width": 64,
 "borderSize": 0,
 "paddingLeft": 0,
 "minWidth": 1,
 "class": "IconButton",
 "verticalAlign": "middle",
 "iconURL": "skin/IconButton_8890AD7C_AF3A_A716_41D7_D5ACF7CBB89B.png",
 "bottom": "2.59%",
 "mode": "toggle",
 "height": 64,
 "shadow": false,
 "maxWidth": 64,
 "paddingTop": 0,
 "maxHeight": 64,
 "backgroundOpacity": 0,
 "paddingRight": 0,
 "borderRadius": 0,
 "horizontalAlign": "center",
 "paddingBottom": 0,
 "cursor": "hand",
 "minHeight": 1,
 "data": {
  "name": "IconButton53544"
 }
},
{
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_266A2362_2C3C_7C4F_41C5_86D5259F47A8, this.camera_87F6ED0F_AF0B_64F2_41E2_CA3B480ACE1A); this.mainPlayList.set('selectedIndex', 4)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "data": {
  "label": "Polygon"
 },
 "class": "HotspotPanoramaOverlay",
 "useHandCursor": true,
 "id": "overlay_3F7F7E3E_2CC4_C437_418B_1B3C30DCF9D9",
 "maps": [
  {
   "hfov": 87.39,
   "yaw": 137.29,
   "image": {
    "levels": [
     {
      "url": "media/panorama_266A48C5_2C3C_4C55_41B3_1D70C2050903_0_HS_0_1_0_map.gif",
      "width": 200,
      "height": 109,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": 6.55,
   "class": "HotspotPanoramaOverlayMap"
  }
 ]
},
{
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_266A2362_2C3C_7C4F_41C5_86D5259F47A8, this.camera_87CC0D19_AF0B_671E_41E3_E4C8668280BE); this.mainPlayList.set('selectedIndex', 4)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "data": {
  "label": "Polygon"
 },
 "class": "HotspotPanoramaOverlay",
 "useHandCursor": true,
 "id": "overlay_3A5E17BB_2CC4_443D_419B_A48975CA6E16",
 "maps": [
  {
   "hfov": 46.21,
   "yaw": -156.89,
   "image": {
    "levels": [
     {
      "url": "media/panorama_266A48C5_2C3C_4C55_41B3_1D70C2050903_0_HS_1_1_0_map.gif",
      "width": 200,
      "height": 186,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": 3.75,
   "class": "HotspotPanoramaOverlayMap"
  }
 ]
},
{
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "items": [
  {
   "hfov": 8.63,
   "image": "this.AnimatedImageResource_3FF2BD5B_2CCC_447D_41A6_1344EE648DAF",
   "pitch": -25.11,
   "yaw": -7.82,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "useHandCursor": true,
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_39C695A0_2CCC_44CB_41A9_6B28A42A96B1",
 "data": {
  "label": "Circle Point 02c"
 },
 "maps": [
  {
   "hfov": 8.63,
   "yaw": -7.82,
   "image": {
    "levels": [
     {
      "url": "media/panorama_266A48C5_2C3C_4C55_41B3_1D70C2050903_1_HS_3_0_0_map.gif",
      "width": 27,
      "height": 16,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -25.11,
   "class": "HotspotPanoramaOverlayMap"
  }
 ]
},
{
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_26667EAB_2C3C_44DC_41BD_508AF18BD0E5, this.camera_87F1BD05_AF0B_64F6_41D0_8C3AAB8F6CF3); this.mainPlayList.set('selectedIndex', 2)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "data": {
  "label": "Polygon"
 },
 "class": "HotspotPanoramaOverlay",
 "useHandCursor": true,
 "id": "overlay_393B0602_2CDC_C7CF_41A2_9234B59A3EB3",
 "maps": [
  {
   "hfov": 115.87,
   "yaw": 3.89,
   "image": {
    "levels": [
     {
      "url": "media/panorama_266A48C5_2C3C_4C55_41B3_1D70C2050903_0_HS_4_1_0_map.gif",
      "width": 200,
      "height": 70,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -8.89,
   "class": "HotspotPanoramaOverlayMap"
  }
 ]
},
{
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "items": [
  {
   "hfov": 8.97,
   "image": "this.AnimatedImageResource_4D645E88_557A_B8B7_41CE_804F462F1C48",
   "pitch": -6.75,
   "yaw": 132.77,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 50
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "useHandCursor": true,
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_42B6D692_557A_A8DB_41C0_F4A8AEA6FF46",
 "data": {
  "label": "Arrow 06a Right-Up"
 },
 "maps": [
  {
   "hfov": 8.97,
   "yaw": 132.77,
   "image": {
    "levels": [
     {
      "url": "media/panorama_266A48C5_2C3C_4C55_41B3_1D70C2050903_0_HS_5_0_0_map.gif",
      "width": 29,
      "height": 16,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -6.75,
   "class": "HotspotPanoramaOverlayMap"
  }
 ]
},
{
 "rotate": false,
 "angle": 0,
 "image": {
  "levels": [
   {
    "url": "media/panorama_2650731A_2C3C_7DFF_41BF_42020C9917DD_tcap0.png",
    "width": 500,
    "height": 500,
    "class": "ImageResourceLevel"
   }
  ],
  "class": "ImageResource"
 },
 "class": "TripodCapPanoramaOverlay",
 "hfov": 45,
 "id": "panorama_266A48C5_2C3C_4C55_41B3_1D70C2050903_tcap0",
 "distance": 50,
 "inertia": false
},
{
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_264C2F16_2C3C_C5F7_41C0_5EA2911E8144, this.camera_87F81CFB_AF0B_6512_41C4_0906C5BB57DE); this.mainPlayList.set('selectedIndex', 31)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "data": {
  "label": "Polygon"
 },
 "class": "HotspotPanoramaOverlay",
 "useHandCursor": true,
 "id": "overlay_8EEB2741_AF0A_A36E_41D6_496E6189138A",
 "maps": [
  {
   "hfov": 89.6,
   "yaw": -102.25,
   "image": {
    "levels": [
     {
      "url": "media/panorama_266A48C5_2C3C_4C55_41B3_1D70C2050903_0_HS_6_1_0_map.gif",
      "width": 200,
      "height": 105,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -2.21,
   "class": "HotspotPanoramaOverlayMap"
  }
 ]
},
{
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "items": [
  {
   "hfov": 10.27,
   "image": "this.AnimatedImageResource_8BCD0198_AF7E_FF1E_41D2_A4B8BC09EC70",
   "pitch": -16.17,
   "yaw": -91.19,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "useHandCursor": true,
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_B25E885B_AF0A_ED12_41D5_0B9187259236",
 "data": {
  "label": "Circle Point 02c"
 },
 "maps": [
  {
   "hfov": 10.27,
   "yaw": -91.19,
   "image": {
    "levels": [
     {
      "url": "media/panorama_266A48C5_2C3C_4C55_41B3_1D70C2050903_0_HS_7_0_0_map.gif",
      "width": 27,
      "height": 16,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -16.17,
   "class": "HotspotPanoramaOverlayMap"
  }
 ]
},
{
 "rotate": false,
 "angle": 0,
 "image": {
  "levels": [
   {
    "url": "media/panorama_2650731A_2C3C_7DFF_41BF_42020C9917DD_tcap0.png",
    "width": 500,
    "height": 500,
    "class": "ImageResourceLevel"
   }
  ],
  "class": "ImageResource"
 },
 "class": "TripodCapPanoramaOverlay",
 "hfov": 45,
 "id": "panorama_266ACC21_2C3C_CBCD_41B6_407672D395B3_tcap0",
 "distance": 50,
 "inertia": false
},
{
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_266A5334_2C3C_BDCB_41C0_5ECFC0F03DE9, this.camera_85945F96_AF0B_6312_41CD_4A68AD96E5F9); this.mainPlayList.set('selectedIndex', 15)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "data": {
  "label": "Polygon"
 },
 "class": "HotspotPanoramaOverlay",
 "useHandCursor": true,
 "id": "overlay_BA29C9F9_AF07_6F1F_41E5_B9368C5B7A70",
 "maps": [
  {
   "hfov": 90,
   "yaw": 0,
   "image": {
    "levels": [
     {
      "url": "media/panorama_266ACC21_2C3C_CBCD_41B6_407672D395B3_0_HS_0_1_0_map.gif",
      "width": 200,
      "height": 200,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": 0,
   "class": "HotspotPanoramaOverlayMap"
  },
  {
   "hfov": 90,
   "yaw": -180,
   "image": {
    "levels": [
     {
      "url": "media/panorama_266ACC21_2C3C_CBCD_41B6_407672D395B3_0_HS_0_2_2_map.gif",
      "width": 200,
      "height": 200,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": 0,
   "class": "HotspotPanoramaOverlayMap"
  },
  {
   "hfov": 90,
   "yaw": -90,
   "image": {
    "levels": [
     {
      "url": "media/panorama_266ACC21_2C3C_CBCD_41B6_407672D395B3_0_HS_0_3_3_map.gif",
      "width": 200,
      "height": 200,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": 0,
   "class": "HotspotPanoramaOverlayMap"
  },
  {
   "hfov": 90,
   "yaw": 0,
   "image": {
    "levels": [
     {
      "url": "media/panorama_266ACC21_2C3C_CBCD_41B6_407672D395B3_0_HS_0_4_4_map.gif",
      "width": 200,
      "height": 200,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": 90,
   "class": "HotspotPanoramaOverlayMap"
  },
  {
   "hfov": 90,
   "yaw": 0,
   "image": {
    "levels": [
     {
      "url": "media/panorama_266ACC21_2C3C_CBCD_41B6_407672D395B3_0_HS_0_5_5_map.gif",
      "width": 200,
      "height": 200,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -90,
   "class": "HotspotPanoramaOverlayMap"
  }
 ]
},
{
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "items": [
  {
   "hfov": 16.19,
   "image": "this.AnimatedImageResource_82C4C28B_AF0A_DDF2_41E0_3733ECB5366C",
   "pitch": -22.32,
   "yaw": -98.13,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "useHandCursor": true,
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_B91C0999_AF07_6F1E_41CF_17B60A7549EE",
 "data": {
  "label": "Circle Point 02c"
 },
 "maps": [
  {
   "hfov": 16.19,
   "yaw": -98.13,
   "image": {
    "levels": [
     {
      "url": "media/panorama_266ACC21_2C3C_CBCD_41B6_407672D395B3_0_HS_1_0_6_map.gif",
      "width": 27,
      "height": 16,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -22.32,
   "class": "HotspotPanoramaOverlayMap"
  }
 ]
},
{
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_266A4FDB_2C3C_447D_41C1_296818159F21, this.camera_85659FA7_AF0B_6332_41E0_41FD7C7BA1FD); this.mainPlayList.set('selectedIndex', 17)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "data": {
  "label": "Polygon"
 },
 "class": "HotspotPanoramaOverlay",
 "useHandCursor": true,
 "id": "overlay_BAC0578F_AF06_E3F1_41DA_050391A74A36",
 "maps": [
  {
   "hfov": 90,
   "yaw": 0,
   "image": {
    "levels": [
     {
      "url": "media/panorama_266ACC21_2C3C_CBCD_41B6_407672D395B3_0_HS_2_1_0_map.gif",
      "width": 200,
      "height": 200,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": 0,
   "class": "HotspotPanoramaOverlayMap"
  },
  {
   "hfov": 90,
   "yaw": 90,
   "image": {
    "levels": [
     {
      "url": "media/panorama_266ACC21_2C3C_CBCD_41B6_407672D395B3_0_HS_2_2_1_map.gif",
      "width": 200,
      "height": 200,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": 0,
   "class": "HotspotPanoramaOverlayMap"
  },
  {
   "hfov": 90,
   "yaw": -180,
   "image": {
    "levels": [
     {
      "url": "media/panorama_266ACC21_2C3C_CBCD_41B6_407672D395B3_0_HS_2_3_2_map.gif",
      "width": 200,
      "height": 200,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": 0,
   "class": "HotspotPanoramaOverlayMap"
  },
  {
   "hfov": 90,
   "yaw": 0,
   "image": {
    "levels": [
     {
      "url": "media/panorama_266ACC21_2C3C_CBCD_41B6_407672D395B3_0_HS_2_4_4_map.gif",
      "width": 200,
      "height": 200,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": 90,
   "class": "HotspotPanoramaOverlayMap"
  },
  {
   "hfov": 90,
   "yaw": 0,
   "image": {
    "levels": [
     {
      "url": "media/panorama_266ACC21_2C3C_CBCD_41B6_407672D395B3_0_HS_2_5_5_map.gif",
      "width": 200,
      "height": 200,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -90,
   "class": "HotspotPanoramaOverlayMap"
  }
 ]
},
{
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "items": [
  {
   "hfov": 10.55,
   "image": "this.AnimatedImageResource_B5286C41_AF09_656E_41D5_C0E270809CC3",
   "pitch": -44.86,
   "yaw": 84.42,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "useHandCursor": true,
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_BAE959F9_AF79_EF1E_41D9_C07EEA0EE2DC",
 "data": {
  "label": "Circle Point 02c"
 },
 "maps": [
  {
   "hfov": 10.55,
   "yaw": 84.42,
   "image": {
    "levels": [
     {
      "url": "media/panorama_266ACC21_2C3C_CBCD_41B6_407672D395B3_0_HS_3_0_6_map.gif",
      "width": 27,
      "height": 16,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -44.86,
   "class": "HotspotPanoramaOverlayMap"
  }
 ]
},
{
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_26660E76_2C3C_C437_41C0_4932F3D787B3, this.camera_85ED7F20_AF0B_632E_41E2_EDC4EAB024A0); this.mainPlayList.set('selectedIndex', 11)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "data": {
  "label": "Polygon"
 },
 "class": "HotspotPanoramaOverlay",
 "useHandCursor": true,
 "id": "overlay_7BB38962_6064_90AE_419F_298A326F6706",
 "maps": [
  {
   "hfov": 120.29,
   "yaw": -121.47,
   "image": {
    "levels": [
     {
      "url": "media/panorama_2640B699_2C3C_C4FC_4199_0A1F70F8E313_0_HS_0_1_0_map.gif",
      "width": 142,
      "height": 200,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": 0.72,
   "class": "HotspotPanoramaOverlayMap"
  }
 ]
},
{
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "items": [
  {
   "hfov": 15.46,
   "image": "this.AnimatedImageResource_7E703AF1_605D_91AA_41D0_AF0B0EAB517F",
   "pitch": -17.8,
   "yaw": -146.19,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "useHandCursor": true,
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_7C53B65E_6065_B097_41D3_146084FA2442",
 "data": {
  "label": "Circle Point 02c"
 },
 "maps": [
  {
   "hfov": 15.46,
   "yaw": -146.19,
   "image": {
    "levels": [
     {
      "url": "media/panorama_2640B699_2C3C_C4FC_4199_0A1F70F8E313_0_HS_1_0_0_map.gif",
      "width": 27,
      "height": 16,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -17.8,
   "class": "HotspotPanoramaOverlayMap"
  }
 ]
},
{
 "rotate": false,
 "angle": 0,
 "image": {
  "levels": [
   {
    "url": "media/panorama_2650731A_2C3C_7DFF_41BF_42020C9917DD_tcap0.png",
    "width": 500,
    "height": 500,
    "class": "ImageResourceLevel"
   }
  ],
  "class": "ImageResource"
 },
 "class": "TripodCapPanoramaOverlay",
 "hfov": 45,
 "id": "panorama_2640B699_2C3C_C4FC_4199_0A1F70F8E313_tcap0",
 "distance": 50,
 "inertia": false
},
{
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_2666F540_2C3C_C44C_41C0_1FA76F1EECB2, this.camera_8800CC9D_AF0B_6516_41E5_552A1BEB3C43); this.mainPlayList.set('selectedIndex', 10)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "data": {
  "label": "Polygon"
 },
 "class": "HotspotPanoramaOverlay",
 "useHandCursor": true,
 "items": [
  {
   "hfov": 90,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 50,
   "image": {
    "levels": [
     {
      "url": "media/panorama_26660E76_2C3C_C437_41C0_4932F3D787B3_0_HS_0_00000.png",
      "width": 964,
      "height": 964,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": 0,
   "roll": 0,
   "yaw": 0
  },
  {
   "distance": 50,
   "image": {
    "levels": [
     {
      "url": "media/panorama_26660E76_2C3C_C437_41C0_4932F3D787B3_0_HS_0_00001.png",
      "width": 964,
      "height": 964,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": 0,
   "hfov": 90,
   "yaw": 90,
   "class": "HotspotPanoramaOverlayImage"
  },
  {
   "distance": 50,
   "image": {
    "levels": [
     {
      "url": "media/panorama_26660E76_2C3C_C437_41C0_4932F3D787B3_0_HS_0_00002.png",
      "width": 964,
      "height": 964,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": 0,
   "hfov": 90,
   "yaw": -180,
   "class": "HotspotPanoramaOverlayImage"
  },
  {
   "distance": 50,
   "image": {
    "levels": [
     {
      "url": "media/panorama_26660E76_2C3C_C437_41C0_4932F3D787B3_0_HS_0_00004.png",
      "width": 964,
      "height": 964,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": 90,
   "hfov": 90,
   "yaw": 0,
   "class": "HotspotPanoramaOverlayImage"
  },
  {
   "distance": 50,
   "image": {
    "levels": [
     {
      "url": "media/panorama_26660E76_2C3C_C437_41C0_4932F3D787B3_0_HS_0_00005.png",
      "width": 964,
      "height": 964,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -90,
   "hfov": 90,
   "yaw": 0,
   "class": "HotspotPanoramaOverlayImage"
  }
 ],
 "id": "overlay_7A15144A_606C_90FE_41D4_8FE13E1CB1CA",
 "maps": [
  {
   "hfov": 90,
   "yaw": 0,
   "image": {
    "levels": [
     {
      "url": "media/panorama_26660E76_2C3C_C437_41C0_4932F3D787B3_0_HS_0_1_0_map.gif",
      "width": 200,
      "height": 200,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": 0,
   "class": "HotspotPanoramaOverlayMap"
  },
  {
   "hfov": 90,
   "yaw": 90,
   "image": {
    "levels": [
     {
      "url": "media/panorama_26660E76_2C3C_C437_41C0_4932F3D787B3_0_HS_0_2_1_map.gif",
      "width": 200,
      "height": 200,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": 0,
   "class": "HotspotPanoramaOverlayMap"
  },
  {
   "hfov": 90,
   "yaw": -180,
   "image": {
    "levels": [
     {
      "url": "media/panorama_26660E76_2C3C_C437_41C0_4932F3D787B3_0_HS_0_3_2_map.gif",
      "width": 200,
      "height": 200,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": 0,
   "class": "HotspotPanoramaOverlayMap"
  },
  {
   "hfov": 90,
   "yaw": 0,
   "image": {
    "levels": [
     {
      "url": "media/panorama_26660E76_2C3C_C437_41C0_4932F3D787B3_0_HS_0_4_4_map.gif",
      "width": 200,
      "height": 200,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": 90,
   "class": "HotspotPanoramaOverlayMap"
  },
  {
   "hfov": 90,
   "yaw": 0,
   "image": {
    "levels": [
     {
      "url": "media/panorama_26660E76_2C3C_C437_41C0_4932F3D787B3_0_HS_0_5_5_map.gif",
      "width": 200,
      "height": 200,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -90,
   "class": "HotspotPanoramaOverlayMap"
  }
 ]
},
{
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "items": [
  {
   "hfov": 16.37,
   "image": "this.AnimatedImageResource_7E711AEF_605D_91B5_41BD_DE7F806C68F9",
   "pitch": -26.67,
   "yaw": 108.7,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "useHandCursor": true,
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_7BADA48C_606D_907A_41C2_A0C87549D740",
 "data": {
  "label": "Circle Point 02c"
 },
 "maps": [
  {
   "hfov": 16.37,
   "yaw": 108.7,
   "image": {
    "levels": [
     {
      "url": "media/panorama_26660E76_2C3C_C437_41C0_4932F3D787B3_0_HS_1_0_6_map.gif",
      "width": 27,
      "height": 16,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -26.67,
   "class": "HotspotPanoramaOverlayMap"
  }
 ]
},
{
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_2640B699_2C3C_C4FC_4199_0A1F70F8E313, this.camera_8806ECAE_AF0B_6532_41E5_3414F2C8D303); this.mainPlayList.set('selectedIndex', 12)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "data": {
  "label": "Polygon"
 },
 "class": "HotspotPanoramaOverlay",
 "useHandCursor": true,
 "items": [
  {
   "hfov": 90,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 50,
   "image": {
    "levels": [
     {
      "url": "media/panorama_26660E76_2C3C_C437_41C0_4932F3D787B3_0_HS_2_00000.png",
      "width": 964,
      "height": 964,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": 0,
   "roll": 0,
   "yaw": 0
  },
  {
   "distance": 50,
   "image": {
    "levels": [
     {
      "url": "media/panorama_26660E76_2C3C_C437_41C0_4932F3D787B3_0_HS_2_00002.png",
      "width": 964,
      "height": 964,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": 0,
   "hfov": 90,
   "yaw": -180,
   "class": "HotspotPanoramaOverlayImage"
  },
  {
   "distance": 50,
   "image": {
    "levels": [
     {
      "url": "media/panorama_26660E76_2C3C_C437_41C0_4932F3D787B3_0_HS_2_00003.png",
      "width": 964,
      "height": 964,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": 0,
   "hfov": 90,
   "yaw": -90,
   "class": "HotspotPanoramaOverlayImage"
  },
  {
   "distance": 50,
   "image": {
    "levels": [
     {
      "url": "media/panorama_26660E76_2C3C_C437_41C0_4932F3D787B3_0_HS_2_00004.png",
      "width": 964,
      "height": 964,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": 90,
   "hfov": 90,
   "yaw": 0,
   "class": "HotspotPanoramaOverlayImage"
  },
  {
   "distance": 50,
   "image": {
    "levels": [
     {
      "url": "media/panorama_26660E76_2C3C_C437_41C0_4932F3D787B3_0_HS_2_00005.png",
      "width": 964,
      "height": 964,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -90,
   "hfov": 90,
   "yaw": 0,
   "class": "HotspotPanoramaOverlayImage"
  }
 ],
 "id": "overlay_7B894CA2_606D_91AE_41D4_B150B2C1F646",
 "maps": [
  {
   "hfov": 90,
   "yaw": 0,
   "image": {
    "levels": [
     {
      "url": "media/panorama_26660E76_2C3C_C437_41C0_4932F3D787B3_0_HS_2_1_0_map.gif",
      "width": 200,
      "height": 200,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": 0,
   "class": "HotspotPanoramaOverlayMap"
  },
  {
   "hfov": 90,
   "yaw": -180,
   "image": {
    "levels": [
     {
      "url": "media/panorama_26660E76_2C3C_C437_41C0_4932F3D787B3_0_HS_2_2_2_map.gif",
      "width": 200,
      "height": 200,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": 0,
   "class": "HotspotPanoramaOverlayMap"
  },
  {
   "hfov": 90,
   "yaw": -90,
   "image": {
    "levels": [
     {
      "url": "media/panorama_26660E76_2C3C_C437_41C0_4932F3D787B3_0_HS_2_3_3_map.gif",
      "width": 200,
      "height": 200,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": 0,
   "class": "HotspotPanoramaOverlayMap"
  },
  {
   "hfov": 90,
   "yaw": 0,
   "image": {
    "levels": [
     {
      "url": "media/panorama_26660E76_2C3C_C437_41C0_4932F3D787B3_0_HS_2_4_4_map.gif",
      "width": 200,
      "height": 200,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": 90,
   "class": "HotspotPanoramaOverlayMap"
  },
  {
   "hfov": 90,
   "yaw": 0,
   "image": {
    "levels": [
     {
      "url": "media/panorama_26660E76_2C3C_C437_41C0_4932F3D787B3_0_HS_2_5_5_map.gif",
      "width": 200,
      "height": 200,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -90,
   "class": "HotspotPanoramaOverlayMap"
  }
 ]
},
{
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "items": [
  {
   "hfov": 17.39,
   "image": "this.AnimatedImageResource_7E71AAF0_605D_91AA_416E_4B995B6D8480",
   "pitch": -21.53,
   "yaw": -73.57,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "useHandCursor": true,
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_7B900F01_606C_906A_41CF_B2AFAE8E193B",
 "data": {
  "label": "Circle Point 02c"
 },
 "maps": [
  {
   "hfov": 17.39,
   "yaw": -73.57,
   "image": {
    "levels": [
     {
      "url": "media/panorama_26660E76_2C3C_C437_41C0_4932F3D787B3_0_HS_3_0_6_map.gif",
      "width": 27,
      "height": 16,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -21.53,
   "class": "HotspotPanoramaOverlayMap"
  }
 ]
},
{
 "rotate": false,
 "angle": 0,
 "image": {
  "levels": [
   {
    "url": "media/panorama_2650731A_2C3C_7DFF_41BF_42020C9917DD_tcap0.png",
    "width": 500,
    "height": 500,
    "class": "ImageResourceLevel"
   }
  ],
  "class": "ImageResource"
 },
 "class": "TripodCapPanoramaOverlay",
 "hfov": 45,
 "id": "panorama_26660E76_2C3C_C437_41C0_4932F3D787B3_tcap0",
 "distance": 50,
 "inertia": false
},
{
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_2669B134_2C3F_DDCB_41BB_88BE90D98D45, this.camera_87EF8CE6_AF0B_6532_41CE_B1DA45B039A6); this.mainPlayList.set('selectedIndex', 20)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "data": {
  "label": "Polygon"
 },
 "class": "HotspotPanoramaOverlay",
 "useHandCursor": true,
 "id": "overlay_77036939_605F_909D_41C4_E4402E0E9C31",
 "maps": [
  {
   "hfov": 90,
   "yaw": 0,
   "image": {
    "levels": [
     {
      "url": "media/panorama_266659AF_2C3C_4CD5_41A2_2211D54F0994_0_HS_0_1_0_map.gif",
      "width": 200,
      "height": 200,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": 0,
   "class": "HotspotPanoramaOverlayMap"
  },
  {
   "hfov": 90,
   "yaw": 90,
   "image": {
    "levels": [
     {
      "url": "media/panorama_266659AF_2C3C_4CD5_41A2_2211D54F0994_0_HS_0_2_1_map.gif",
      "width": 200,
      "height": 200,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": 0,
   "class": "HotspotPanoramaOverlayMap"
  },
  {
   "hfov": 90,
   "yaw": -90,
   "image": {
    "levels": [
     {
      "url": "media/panorama_266659AF_2C3C_4CD5_41A2_2211D54F0994_0_HS_0_3_3_map.gif",
      "width": 200,
      "height": 200,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": 0,
   "class": "HotspotPanoramaOverlayMap"
  },
  {
   "hfov": 90,
   "yaw": 0,
   "image": {
    "levels": [
     {
      "url": "media/panorama_266659AF_2C3C_4CD5_41A2_2211D54F0994_0_HS_0_4_4_map.gif",
      "width": 200,
      "height": 200,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": 90,
   "class": "HotspotPanoramaOverlayMap"
  }
 ]
},
{
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "items": [
  {
   "hfov": 8,
   "image": "this.AnimatedImageResource_7B4B902A_607C_B0BE_41CD_68292A06C0AD",
   "pitch": -13.76,
   "yaw": -38.45,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "useHandCursor": true,
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_781F6465_605C_90AA_4151_520C5B999650",
 "data": {
  "label": "Circle Point 02c"
 },
 "maps": [
  {
   "hfov": 8,
   "yaw": -38.45,
   "image": {
    "levels": [
     {
      "url": "media/panorama_266659AF_2C3C_4CD5_41A2_2211D54F0994_0_HS_1_0_6_map.gif",
      "width": 27,
      "height": 16,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -13.76,
   "class": "HotspotPanoramaOverlayMap"
  }
 ]
},
{
 "rotate": false,
 "angle": 0,
 "image": {
  "levels": [
   {
    "url": "media/panorama_2650731A_2C3C_7DFF_41BF_42020C9917DD_tcap0.png",
    "width": 500,
    "height": 500,
    "class": "ImageResourceLevel"
   }
  ],
  "class": "ImageResource"
 },
 "class": "TripodCapPanoramaOverlay",
 "hfov": 45,
 "id": "panorama_266659AF_2C3C_4CD5_41A2_2211D54F0994_tcap0",
 "distance": 50,
 "inertia": false
},
{
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_2669CEC5_2C3F_C455_41C1_4FFEA2873441, this.camera_87E50CF0_AF0B_652E_41D5_F890DCC75595); this.mainPlayList.set('selectedIndex', 30)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "data": {
  "label": "Polygon"
 },
 "class": "HotspotPanoramaOverlay",
 "useHandCursor": true,
 "id": "overlay_8BE11369_AF0B_633E_41DD_1120E7681060",
 "maps": [
  {
   "hfov": 90,
   "yaw": 0,
   "image": {
    "levels": [
     {
      "url": "media/panorama_266659AF_2C3C_4CD5_41A2_2211D54F0994_0_HS_2_1_0_map.gif",
      "width": 200,
      "height": 200,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": 0,
   "class": "HotspotPanoramaOverlayMap"
  },
  {
   "hfov": 90,
   "yaw": 90,
   "image": {
    "levels": [
     {
      "url": "media/panorama_266659AF_2C3C_4CD5_41A2_2211D54F0994_0_HS_2_2_1_map.gif",
      "width": 200,
      "height": 200,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": 0,
   "class": "HotspotPanoramaOverlayMap"
  },
  {
   "hfov": 90,
   "yaw": -180,
   "image": {
    "levels": [
     {
      "url": "media/panorama_266659AF_2C3C_4CD5_41A2_2211D54F0994_0_HS_2_3_2_map.gif",
      "width": 200,
      "height": 200,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": 0,
   "class": "HotspotPanoramaOverlayMap"
  },
  {
   "hfov": 90,
   "yaw": 0,
   "image": {
    "levels": [
     {
      "url": "media/panorama_266659AF_2C3C_4CD5_41A2_2211D54F0994_0_HS_2_4_4_map.gif",
      "width": 200,
      "height": 200,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": 90,
   "class": "HotspotPanoramaOverlayMap"
  },
  {
   "hfov": 90,
   "yaw": 0,
   "image": {
    "levels": [
     {
      "url": "media/panorama_266659AF_2C3C_4CD5_41A2_2211D54F0994_0_HS_2_5_5_map.gif",
      "width": 200,
      "height": 200,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -90,
   "class": "HotspotPanoramaOverlayMap"
  }
 ]
},
{
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "items": [
  {
   "hfov": 16.64,
   "image": "this.AnimatedImageResource_8B5D5992_AF0A_AF12_41B2_D6581B585D97",
   "pitch": -19.91,
   "yaw": 95.64,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "useHandCursor": true,
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_8BBC6562_AF0B_6732_41E3_634E0A701007",
 "data": {
  "label": "Circle Point 02c"
 },
 "maps": [
  {
   "hfov": 16.64,
   "yaw": 95.64,
   "image": {
    "levels": [
     {
      "url": "media/panorama_266659AF_2C3C_4CD5_41A2_2211D54F0994_0_HS_3_0_6_map.gif",
      "width": 27,
      "height": 16,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -19.91,
   "class": "HotspotPanoramaOverlayMap"
  }
 ]
},
{
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_2669D8F8_2C3F_CC3B_41C4_43F82B11C465, this.camera_86C5FE4B_AF0B_6572_41DE_DDF7F8203E04); this.mainPlayList.set('selectedIndex', 22)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "data": {
  "label": "Polygon"
 },
 "class": "HotspotPanoramaOverlay",
 "useHandCursor": true,
 "id": "overlay_78CEBFDB_6064_8F9E_41D6_FAAA8E5BA31B",
 "maps": [
  {
   "hfov": 90,
   "yaw": 0,
   "image": {
    "levels": [
     {
      "url": "media/panorama_2669E37C_2C3F_DC3B_41AF_EA365FC497F6_0_HS_0_1_0_map.gif",
      "width": 200,
      "height": 200,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": 0,
   "class": "HotspotPanoramaOverlayMap"
  },
  {
   "hfov": 90,
   "yaw": -180,
   "image": {
    "levels": [
     {
      "url": "media/panorama_2669E37C_2C3F_DC3B_41AF_EA365FC497F6_0_HS_0_2_2_map.gif",
      "width": 200,
      "height": 200,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": 0,
   "class": "HotspotPanoramaOverlayMap"
  },
  {
   "hfov": 90,
   "yaw": -90,
   "image": {
    "levels": [
     {
      "url": "media/panorama_2669E37C_2C3F_DC3B_41AF_EA365FC497F6_0_HS_0_3_3_map.gif",
      "width": 200,
      "height": 200,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": 0,
   "class": "HotspotPanoramaOverlayMap"
  },
  {
   "hfov": 90,
   "yaw": 0,
   "image": {
    "levels": [
     {
      "url": "media/panorama_2669E37C_2C3F_DC3B_41AF_EA365FC497F6_0_HS_0_4_4_map.gif",
      "width": 200,
      "height": 200,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": 90,
   "class": "HotspotPanoramaOverlayMap"
  },
  {
   "hfov": 90,
   "yaw": 0,
   "image": {
    "levels": [
     {
      "url": "media/panorama_2669E37C_2C3F_DC3B_41AF_EA365FC497F6_0_HS_0_5_5_map.gif",
      "width": 200,
      "height": 200,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -90,
   "class": "HotspotPanoramaOverlayMap"
  }
 ]
},
{
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "items": [
  {
   "hfov": 14.59,
   "image": "this.AnimatedImageResource_7B4A302A_607C_B0BE_41A8_A6F665240DDF",
   "pitch": -29.79,
   "yaw": -64.95,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "useHandCursor": true,
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_7919490E_6065_9076_41D7_AC3D769D54F6",
 "data": {
  "label": "Circle Point 02c"
 },
 "maps": [
  {
   "hfov": 14.59,
   "yaw": -64.95,
   "image": {
    "levels": [
     {
      "url": "media/panorama_2669E37C_2C3F_DC3B_41AF_EA365FC497F6_0_HS_1_0_6_map.gif",
      "width": 27,
      "height": 16,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -29.79,
   "class": "HotspotPanoramaOverlayMap"
  }
 ]
},
{
 "rotate": false,
 "angle": 0,
 "image": {
  "levels": [
   {
    "url": "media/panorama_2650731A_2C3C_7DFF_41BF_42020C9917DD_tcap0.png",
    "width": 500,
    "height": 500,
    "class": "ImageResourceLevel"
   }
  ],
  "class": "ImageResource"
 },
 "class": "TripodCapPanoramaOverlay",
 "hfov": 45,
 "id": "panorama_2669E37C_2C3F_DC3B_41AF_EA365FC497F6_tcap0",
 "distance": 50,
 "inertia": false
},
{
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_2669B134_2C3F_DDCB_41BB_88BE90D98D45, this.camera_85D3BF4C_AF0B_6376_41DF_9B2B0BF7DF16); this.mainPlayList.set('selectedIndex', 20)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "data": {
  "label": "Polygon"
 },
 "class": "HotspotPanoramaOverlay",
 "useHandCursor": true,
 "id": "overlay_751DA289_602C_907A_41C5_FD4DEBEBF11D",
 "maps": [
  {
   "hfov": 90,
   "yaw": 0,
   "image": {
    "levels": [
     {
      "url": "media/panorama_2669A39A_2C3C_5CFF_41C0_F596914DA092_0_HS_0_1_0_map.gif",
      "width": 200,
      "height": 200,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": 0,
   "class": "HotspotPanoramaOverlayMap"
  },
  {
   "hfov": 90,
   "yaw": 90,
   "image": {
    "levels": [
     {
      "url": "media/panorama_2669A39A_2C3C_5CFF_41C0_F596914DA092_0_HS_0_2_1_map.gif",
      "width": 200,
      "height": 200,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": 0,
   "class": "HotspotPanoramaOverlayMap"
  },
  {
   "hfov": 90,
   "yaw": -180,
   "image": {
    "levels": [
     {
      "url": "media/panorama_2669A39A_2C3C_5CFF_41C0_F596914DA092_0_HS_0_3_2_map.gif",
      "width": 200,
      "height": 200,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": 0,
   "class": "HotspotPanoramaOverlayMap"
  },
  {
   "hfov": 90,
   "yaw": -90,
   "image": {
    "levels": [
     {
      "url": "media/panorama_2669A39A_2C3C_5CFF_41C0_F596914DA092_0_HS_0_4_3_map.gif",
      "width": 200,
      "height": 200,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": 0,
   "class": "HotspotPanoramaOverlayMap"
  },
  {
   "hfov": 90,
   "yaw": 0,
   "image": {
    "levels": [
     {
      "url": "media/panorama_2669A39A_2C3C_5CFF_41C0_F596914DA092_0_HS_0_5_4_map.gif",
      "width": 200,
      "height": 200,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": 90,
   "class": "HotspotPanoramaOverlayMap"
  },
  {
   "hfov": 90,
   "yaw": 0,
   "image": {
    "levels": [
     {
      "url": "media/panorama_2669A39A_2C3C_5CFF_41C0_F596914DA092_0_HS_0_6_5_map.gif",
      "width": 200,
      "height": 200,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -90,
   "class": "HotspotPanoramaOverlayMap"
  }
 ]
},
{
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "items": [
  {
   "hfov": 11.44,
   "image": "this.AnimatedImageResource_76F37689_605C_907A_41CA_3FCB6C7744C5",
   "pitch": -15.65,
   "yaw": 28.96,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "useHandCursor": true,
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_76482BB2_602D_97AE_4195_AC01F1CC1E6A",
 "data": {
  "label": "Circle Point 02c"
 },
 "maps": [
  {
   "hfov": 11.44,
   "yaw": 28.96,
   "image": {
    "levels": [
     {
      "url": "media/panorama_2669A39A_2C3C_5CFF_41C0_F596914DA092_0_HS_1_0_6_map.gif",
      "width": 27,
      "height": 16,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -15.65,
   "class": "HotspotPanoramaOverlayMap"
  }
 ]
},
{
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_266A7DB6_2C3C_4437_41C1_235AEE268532, this.camera_85A1FF56_AF0B_6312_41E0_5C78EB135768); this.mainPlayList.set('selectedIndex', 18)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "data": {
  "label": "Polygon"
 },
 "class": "HotspotPanoramaOverlay",
 "useHandCursor": true,
 "id": "overlay_76881EB0_6025_F1AA_41C7_1A3AAF535CCD",
 "maps": [
  {
   "hfov": 110.3,
   "yaw": -133.15,
   "image": {
    "levels": [
     {
      "url": "media/panorama_2669A39A_2C3C_5CFF_41C0_F596914DA092_0_HS_2_1_6_map.gif",
      "width": 200,
      "height": 177,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": 17.91,
   "class": "HotspotPanoramaOverlayMap"
  }
 ]
},
{
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "items": [
  {
   "hfov": 9.78,
   "image": "this.AnimatedImageResource_76F4E689_605C_907A_41C1_72C965E0DEB2",
   "pitch": -15.23,
   "yaw": -153.57,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "useHandCursor": true,
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_764BDEC8_6024_91FB_41D6_7F4F4CCB1B72",
 "data": {
  "label": "Circle Point 02c"
 },
 "maps": [
  {
   "hfov": 9.78,
   "yaw": -153.57,
   "image": {
    "levels": [
     {
      "url": "media/panorama_2669A39A_2C3C_5CFF_41C0_F596914DA092_0_HS_3_0_6_map.gif",
      "width": 27,
      "height": 16,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -15.23,
   "class": "HotspotPanoramaOverlayMap"
  }
 ]
},
{
 "rotate": false,
 "angle": 0,
 "image": {
  "levels": [
   {
    "url": "media/panorama_2650731A_2C3C_7DFF_41BF_42020C9917DD_tcap0.png",
    "width": 500,
    "height": 500,
    "class": "ImageResourceLevel"
   }
  ],
  "class": "ImageResource"
 },
 "class": "TripodCapPanoramaOverlay",
 "hfov": 45,
 "id": "panorama_2669A39A_2C3C_5CFF_41C0_F596914DA092_tcap0",
 "distance": 50,
 "inertia": false
},
{
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "class": "HotspotPanoramaOverlay",
 "useHandCursor": true,
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_78EDA10A_606D_907E_41BF_752A623985C3",
 "data": {
  "label": "Polygon"
 },
 "maps": [
  {
   "hfov": 88.29,
   "yaw": -137.51,
   "image": {
    "levels": [
     {
      "url": "media/panorama_2669D8F8_2C3F_CC3B_41C4_43F82B11C465_0_HS_0_1_0_map.gif",
      "width": 163,
      "height": 200,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": 3.54,
   "class": "HotspotPanoramaOverlayMap"
  }
 ]
},
{
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "items": [
  {
   "hfov": 11.9,
   "image": "this.AnimatedImageResource_7B494028_607C_B0BA_41D1_B65F23D3BA1D",
   "pitch": -16.47,
   "yaw": -157.19,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "useHandCursor": true,
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_78F1C850_606D_90EA_41B5_10CACDCF4C98",
 "data": {
  "label": "Circle Point 02c"
 },
 "maps": [
  {
   "hfov": 11.9,
   "yaw": -157.19,
   "image": {
    "levels": [
     {
      "url": "media/panorama_2669D8F8_2C3F_CC3B_41C4_43F82B11C465_0_HS_1_0_0_map.gif",
      "width": 27,
      "height": 16,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -16.47,
   "class": "HotspotPanoramaOverlayMap"
  }
 ]
},
{
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_2669E37C_2C3F_DC3B_41AF_EA365FC497F6, this.camera_85BCAF61_AF0B_632E_41DE_3B66FC1DCF79); this.mainPlayList.set('selectedIndex', 23)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "data": {
  "label": "Polygon"
 },
 "class": "HotspotPanoramaOverlay",
 "useHandCursor": true,
 "id": "overlay_79BCB011_606C_B06A_41C1_18081640B063",
 "maps": [
  {
   "hfov": 90,
   "yaw": 0,
   "image": {
    "levels": [
     {
      "url": "media/panorama_2669D8F8_2C3F_CC3B_41C4_43F82B11C465_0_HS_2_1_0_map.gif",
      "width": 200,
      "height": 200,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": 0,
   "class": "HotspotPanoramaOverlayMap"
  },
  {
   "hfov": 90,
   "yaw": 90,
   "image": {
    "levels": [
     {
      "url": "media/panorama_2669D8F8_2C3F_CC3B_41C4_43F82B11C465_0_HS_2_2_1_map.gif",
      "width": 200,
      "height": 200,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": 0,
   "class": "HotspotPanoramaOverlayMap"
  },
  {
   "hfov": 90,
   "yaw": -90,
   "image": {
    "levels": [
     {
      "url": "media/panorama_2669D8F8_2C3F_CC3B_41C4_43F82B11C465_0_HS_2_3_3_map.gif",
      "width": 200,
      "height": 200,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": 0,
   "class": "HotspotPanoramaOverlayMap"
  },
  {
   "hfov": 90,
   "yaw": 0,
   "image": {
    "levels": [
     {
      "url": "media/panorama_2669D8F8_2C3F_CC3B_41C4_43F82B11C465_0_HS_2_4_4_map.gif",
      "width": 200,
      "height": 200,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": 90,
   "class": "HotspotPanoramaOverlayMap"
  }
 ]
},
{
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "items": [
  {
   "hfov": 9.35,
   "image": "this.AnimatedImageResource_7B4AA029_607C_B0BA_41C3_58B8DA83233B",
   "pitch": -30.21,
   "yaw": 19.92,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "useHandCursor": true,
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_791E77C8_6064_9FFA_41D4_2EDDF3A7438E",
 "data": {
  "label": "Circle Point 02c"
 },
 "maps": [
  {
   "hfov": 9.35,
   "yaw": 19.92,
   "image": {
    "levels": [
     {
      "url": "media/panorama_2669D8F8_2C3F_CC3B_41C4_43F82B11C465_0_HS_3_0_6_map.gif",
      "width": 27,
      "height": 16,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -30.21,
   "class": "HotspotPanoramaOverlayMap"
  }
 ]
},
{
 "rotate": false,
 "angle": 0,
 "image": {
  "levels": [
   {
    "url": "media/panorama_2650731A_2C3C_7DFF_41BF_42020C9917DD_tcap0.png",
    "width": 500,
    "height": 500,
    "class": "ImageResourceLevel"
   }
  ],
  "class": "ImageResource"
 },
 "class": "TripodCapPanoramaOverlay",
 "hfov": 45,
 "id": "panorama_2669D8F8_2C3F_CC3B_41C4_43F82B11C465_tcap0",
 "distance": 50,
 "inertia": false
},
{
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_2650731A_2C3C_7DFF_41BF_42020C9917DD, this.camera_8727EDE5_AF0B_6736_41C9_B28C1B78E18E); this.mainPlayList.set('selectedIndex', 0)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "data": {
  "label": "Polygon"
 },
 "class": "HotspotPanoramaOverlay",
 "useHandCursor": true,
 "id": "overlay_3E0875C4_2C43_C44B_41C2_794D0FDEEC33",
 "maps": [
  {
   "hfov": 103.36,
   "yaw": 125.99,
   "image": {
    "levels": [
     {
      "url": "media/panorama_274E4A2E_2C3D_CFD7_41C3_E749466BFD9F_0_HS_0_1_0_map.gif",
      "width": 200,
      "height": 81,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": 14.01,
   "class": "HotspotPanoramaOverlayMap"
  }
 ]
},
{
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "items": [
  {
   "hfov": 7.24,
   "image": "this.AnimatedImageResource_3F020CDC_2C44_C474_41AB_8E87A08914E1",
   "pitch": -8.47,
   "yaw": 107.52,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "useHandCursor": true,
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_3932B5C7_2C44_4454_41B0_FCC94580F6FF",
 "data": {
  "label": "Circle Point 02c"
 },
 "maps": [
  {
   "hfov": 7.24,
   "yaw": 107.52,
   "image": {
    "levels": [
     {
      "url": "media/panorama_274E4A2E_2C3D_CFD7_41C3_E749466BFD9F_0_HS_1_0_0_map.gif",
      "width": 27,
      "height": 16,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -8.47,
   "class": "HotspotPanoramaOverlayMap"
  }
 ]
},
{
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_26667EAB_2C3C_44DC_41BD_508AF18BD0E5, this.camera_872ADDDB_AF0B_6712_41E3_02A30A8DAEDC); this.mainPlayList.set('selectedIndex', 2)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "data": {
  "label": "Polygon"
 },
 "class": "HotspotPanoramaOverlay",
 "useHandCursor": true,
 "id": "overlay_3F798435_2C44_4435_41C3_DD91DEDF4EE7",
 "maps": [
  {
   "hfov": 90,
   "yaw": 0,
   "image": {
    "levels": [
     {
      "url": "media/panorama_274E4A2E_2C3D_CFD7_41C3_E749466BFD9F_0_HS_2_1_0_map.gif",
      "width": 200,
      "height": 200,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": 0,
   "class": "HotspotPanoramaOverlayMap"
  },
  {
   "hfov": 90,
   "yaw": -90,
   "image": {
    "levels": [
     {
      "url": "media/panorama_274E4A2E_2C3D_CFD7_41C3_E749466BFD9F_0_HS_2_2_3_map.gif",
      "width": 200,
      "height": 200,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": 0,
   "class": "HotspotPanoramaOverlayMap"
  },
  {
   "hfov": 90,
   "yaw": 0,
   "image": {
    "levels": [
     {
      "url": "media/panorama_274E4A2E_2C3D_CFD7_41C3_E749466BFD9F_0_HS_2_3_4_map.gif",
      "width": 200,
      "height": 200,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": 90,
   "class": "HotspotPanoramaOverlayMap"
  }
 ]
},
{
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "items": [
  {
   "hfov": 9.61,
   "image": "this.AnimatedImageResource_39FD02E1_2C3D_FC4D_41C3_B2F6935FFDEB",
   "pitch": -8.6,
   "yaw": -56.8,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "useHandCursor": true,
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_39BA6B47_2C45_CC55_4188_AFDD2A3C6DA0",
 "data": {
  "label": "Circle Point 02c"
 },
 "maps": [
  {
   "hfov": 9.61,
   "yaw": -56.8,
   "image": {
    "levels": [
     {
      "url": "media/panorama_274E4A2E_2C3D_CFD7_41C3_E749466BFD9F_0_HS_3_0_0_map.gif",
      "width": 27,
      "height": 16,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -8.6,
   "class": "HotspotPanoramaOverlayMap"
  }
 ]
},
{
 "rotate": false,
 "angle": 0,
 "image": {
  "levels": [
   {
    "url": "media/panorama_2650731A_2C3C_7DFF_41BF_42020C9917DD_tcap0.png",
    "width": 500,
    "height": 500,
    "class": "ImageResourceLevel"
   }
  ],
  "class": "ImageResource"
 },
 "class": "TripodCapPanoramaOverlay",
 "hfov": 45,
 "id": "panorama_274E4A2E_2C3D_CFD7_41C3_E749466BFD9F_tcap0",
 "distance": 50,
 "inertia": false
},
{
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_266A40B1_2C3C_7CCD_41B2_B5FCEE869E17, this.camera_86AAAE61_AF0B_652E_41E5_F418CE32601B); this.mainPlayList.set('selectedIndex', 13)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "data": {
  "label": "Polygon"
 },
 "class": "HotspotPanoramaOverlay",
 "useHandCursor": true,
 "id": "overlay_4DCA1EFF_5549_D849_41CC_26B7C1A84FD1",
 "maps": [
  {
   "hfov": 122.71,
   "yaw": -101.87,
   "image": {
    "levels": [
     {
      "url": "media/panorama_26667DFA_2C3C_443C_41B2_332913C8F61A_0_HS_0_1_0_map.gif",
      "width": 200,
      "height": 76,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": 9.48,
   "class": "HotspotPanoramaOverlayMap"
  }
 ]
},
{
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "items": [
  {
   "hfov": 7.36,
   "image": "this.AnimatedImageResource_4C4D0777_55BF_A859_41C5_D4C12DB4CF4C",
   "pitch": -10.68,
   "yaw": -107.23,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "useHandCursor": true,
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_4C44EDE3_5546_D87A_41CB_C6217DEF6FAC",
 "data": {
  "label": "Circle Point 02c"
 },
 "maps": [
  {
   "hfov": 7.36,
   "yaw": -107.23,
   "image": {
    "levels": [
     {
      "url": "media/panorama_26667DFA_2C3C_443C_41B2_332913C8F61A_0_HS_1_0_0_map.gif",
      "width": 27,
      "height": 16,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -10.68,
   "class": "HotspotPanoramaOverlayMap"
  }
 ]
},
{
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_266A7DB6_2C3C_4437_41C1_235AEE268532, this.camera_86DE1E57_AF0B_6513_41DA_4E19240CAD5D); this.mainPlayList.set('selectedIndex', 18)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "data": {
  "label": "Polygon"
 },
 "class": "HotspotPanoramaOverlay",
 "useHandCursor": true,
 "id": "overlay_4D22CC7B_5547_B849_41A3_5584CD2C4147",
 "maps": [
  {
   "hfov": 126.68,
   "yaw": 75.12,
   "image": {
    "levels": [
     {
      "url": "media/panorama_26667DFA_2C3C_443C_41B2_332913C8F61A_0_HS_2_1_0_map.gif",
      "width": 200,
      "height": 84,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": 14.56,
   "class": "HotspotPanoramaOverlayMap"
  }
 ]
},
{
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "items": [
  {
   "hfov": 9.58,
   "image": "this.AnimatedImageResource_4C4D3777_55BF_A859_41D3_2FA3B86CEA01",
   "pitch": -13.18,
   "yaw": 71.16,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "useHandCursor": true,
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_4C3D5B30_5546_D9D7_41D3_74CFB915F7E3",
 "data": {
  "label": "Circle Point 02c"
 },
 "maps": [
  {
   "hfov": 9.58,
   "yaw": 71.16,
   "image": {
    "levels": [
     {
      "url": "media/panorama_26667DFA_2C3C_443C_41B2_332913C8F61A_0_HS_3_0_0_map.gif",
      "width": 27,
      "height": 16,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -13.18,
   "class": "HotspotPanoramaOverlayMap"
  }
 ]
},
{
 "rotate": false,
 "angle": 0,
 "image": {
  "levels": [
   {
    "url": "media/panorama_2650731A_2C3C_7DFF_41BF_42020C9917DD_tcap0.png",
    "width": 500,
    "height": 500,
    "class": "ImageResourceLevel"
   }
  ],
  "class": "ImageResource"
 },
 "class": "TripodCapPanoramaOverlay",
 "hfov": 45,
 "id": "panorama_26667DFA_2C3C_443C_41B2_332913C8F61A_tcap0",
 "distance": 50,
 "inertia": false
},
{
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_266A48C5_2C3C_4C55_41B3_1D70C2050903, this.camera_86B99E6C_AF0B_6536_41D4_8556A4B4EC61); this.mainPlayList.set('selectedIndex', 3)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "data": {
  "label": "Polygon"
 },
 "class": "HotspotPanoramaOverlay",
 "useHandCursor": true,
 "id": "overlay_38800F19_2CCC_C5FC_41C3_67E75560E2EC",
 "maps": [
  {
   "hfov": 89.62,
   "yaw": -21.98,
   "image": {
    "levels": [
     {
      "url": "media/panorama_266A2362_2C3C_7C4F_41C5_86D5259F47A8_0_HS_0_1_0_map.gif",
      "width": 200,
      "height": 89,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -1.83,
   "class": "HotspotPanoramaOverlayMap"
  }
 ]
},
{
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "items": [
  {
   "hfov": 9.94,
   "image": "this.AnimatedImageResource_3846CF48_2CC4_445B_41C4_CE98C0375D24",
   "pitch": -25.68,
   "yaw": -0.55,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "useHandCursor": true,
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_3A88EB65_2CCF_CC55_41C2_03ED039CC10A",
 "data": {
  "label": "Circle Point 02c"
 },
 "maps": [
  {
   "hfov": 9.94,
   "yaw": -0.55,
   "image": {
    "levels": [
     {
      "url": "media/panorama_266A2362_2C3C_7C4F_41C5_86D5259F47A8_0_HS_1_0_0_map.gif",
      "width": 27,
      "height": 16,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -25.68,
   "class": "HotspotPanoramaOverlayMap"
  }
 ]
},
{
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_266A5CEF_2C3C_4455_41A5_2CBA724838F2, this.camera_86B22E7C_AF0B_6516_41C9_168CCC9959B1); this.mainPlayList.set('selectedIndex', 5)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "data": {
  "label": "Polygon"
 },
 "class": "HotspotPanoramaOverlay",
 "useHandCursor": true,
 "id": "overlay_380CC19B_2CCC_BCFD_41C4_37D566F4FF6A",
 "maps": [
  {
   "hfov": 50.86,
   "yaw": 155.13,
   "image": {
    "levels": [
     {
      "url": "media/panorama_266A2362_2C3C_7C4F_41C5_86D5259F47A8_0_HS_2_1_0_map.gif",
      "width": 173,
      "height": 200,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": 1.39,
   "class": "HotspotPanoramaOverlayMap"
  }
 ]
},
{
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_266A5CEF_2C3C_4455_41A5_2CBA724838F2, this.camera_86814E8B_AF0B_65F3_41B4_BC5AAC3F8D82); this.mainPlayList.set('selectedIndex', 5)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "data": {
  "label": "Polygon"
 },
 "class": "HotspotPanoramaOverlay",
 "useHandCursor": true,
 "id": "overlay_3818ED43_2CCC_C44D_4196_03713BF83FE8",
 "maps": [
  {
   "hfov": 67.21,
   "yaw": -145.71,
   "image": {
    "levels": [
     {
      "url": "media/panorama_266A2362_2C3C_7C4F_41C5_86D5259F47A8_0_HS_3_1_0_map.gif",
      "width": 200,
      "height": 195,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -1.72,
   "class": "HotspotPanoramaOverlayMap"
  }
 ]
},
{
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "items": [
  {
   "hfov": -12.71,
   "image": "this.AnimatedImageResource_3B16961F_2CDC_C7F5_41AD_53BF33697116",
   "pitch": -242.51,
   "yaw": -122.01,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 50
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "useHandCursor": true,
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_3AECAB15_2CC4_4DF4_41B4_E7501CA5942B",
 "data": {
  "label": "Arrow 05c Left-Up"
 },
 "maps": [
  {
   "hfov": -12.71,
   "yaw": -122.01,
   "image": {
    "levels": [
     {
      "url": "media/panorama_266A2362_2C3C_7C4F_41C5_86D5259F47A8_0_HS_5_0_0_map.gif",
      "width": 44,
      "height": 16,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -242.51,
   "class": "HotspotPanoramaOverlayMap"
  }
 ]
},
{
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "items": [
  {
   "hfov": 9.5,
   "image": "this.AnimatedImageResource_3BFD00E0_2CDC_7C4B_419D_C82FC8908BDD",
   "pitch": -14.92,
   "yaw": -176.68,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "useHandCursor": true,
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_3AACD6A5_2CDC_C4D4_4191_D057DA4A6E6D",
 "data": {
  "label": "Circle Point 02c"
 },
 "maps": [
  {
   "hfov": 9.5,
   "yaw": -176.68,
   "image": {
    "levels": [
     {
      "url": "media/panorama_266A2362_2C3C_7C4F_41C5_86D5259F47A8_0_HS_7_0_0_map.gif",
      "width": 27,
      "height": 16,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -14.92,
   "class": "HotspotPanoramaOverlayMap"
  }
 ]
},
{
 "rotate": false,
 "angle": 0,
 "image": {
  "levels": [
   {
    "url": "media/panorama_2650731A_2C3C_7DFF_41BF_42020C9917DD_tcap0.png",
    "width": 500,
    "height": 500,
    "class": "ImageResourceLevel"
   }
  ],
  "class": "ImageResource"
 },
 "class": "TripodCapPanoramaOverlay",
 "hfov": 45,
 "id": "panorama_266A2362_2C3C_7C4F_41C5_86D5259F47A8_tcap0",
 "distance": 50,
 "inertia": false
},
{
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_2669A39A_2C3C_5CFF_41C0_F596914DA092, this.camera_86675EBE_AF0B_6512_419D_F1DFD3563FEF); this.mainPlayList.set('selectedIndex', 19)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "data": {
  "label": "Polygon"
 },
 "class": "HotspotPanoramaOverlay",
 "useHandCursor": true,
 "id": "overlay_6DCB905E_602B_9501_41B7_2981EF48CBC0",
 "maps": [
  {
   "hfov": 91.57,
   "yaw": 12.18,
   "image": {
    "levels": [
     {
      "url": "media/panorama_2669B134_2C3F_DDCB_41BB_88BE90D98D45_0_HS_0_1_0_map.gif",
      "width": 200,
      "height": 148,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": 23.85,
   "class": "HotspotPanoramaOverlayMap"
  }
 ]
},
{
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "items": [
  {
   "hfov": 6.08,
   "image": "this.AnimatedImageResource_76A2A031_6027_9503_41C4_2C882152374F",
   "pitch": -9.06,
   "yaw": 14.52,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "useHandCursor": true,
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_6E9F98AD_6024_9503_41D7_222095F23811",
 "data": {
  "label": "Circle Point 02c"
 },
 "maps": [
  {
   "hfov": 6.08,
   "yaw": 14.52,
   "image": {
    "levels": [
     {
      "url": "media/panorama_2669B134_2C3F_DDCB_41BB_88BE90D98D45_0_HS_1_0_0_map.gif",
      "width": 27,
      "height": 16,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -9.06,
   "class": "HotspotPanoramaOverlayMap"
  }
 ]
},
{
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_266659AF_2C3C_4CD5_41A2_2211D54F0994, this.camera_864E5ED4_AF0B_6516_41E1_A19C9DBA2DFA); this.mainPlayList.set('selectedIndex', 24)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "data": {
  "label": "Polygon"
 },
 "class": "HotspotPanoramaOverlay",
 "useHandCursor": true,
 "id": "overlay_6E1EBC00_6025_8D02_41D1_894B7BE55612",
 "maps": [
  {
   "hfov": 82.27,
   "yaw": -143.2,
   "image": {
    "levels": [
     {
      "url": "media/panorama_2669B134_2C3F_DDCB_41BB_88BE90D98D45_0_HS_2_1_0_map.gif",
      "width": 177,
      "height": 200,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": 15.85,
   "class": "HotspotPanoramaOverlayMap"
  }
 ]
},
{
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "items": [
  {
   "hfov": 9.89,
   "image": "this.AnimatedImageResource_76A30031_6027_9503_41C8_4DFDDCEA07DE",
   "pitch": -15.01,
   "yaw": -166.43,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "useHandCursor": true,
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_6F5CA1A1_6024_9702_41D7_EB9F64A0B157",
 "data": {
  "label": "Circle Point 02c"
 },
 "maps": [
  {
   "hfov": 9.89,
   "yaw": -166.43,
   "image": {
    "levels": [
     {
      "url": "media/panorama_2669B134_2C3F_DDCB_41BB_88BE90D98D45_0_HS_3_0_0_map.gif",
      "width": 27,
      "height": 16,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -15.01,
   "class": "HotspotPanoramaOverlayMap"
  }
 ]
},
{
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_2669CA02_2C3F_CFCF_41C1_E694A5B56234, this.camera_8673EEC9_AF0B_657E_41D8_7DDA86E6E089); this.mainPlayList.set('selectedIndex', 21)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "data": {
  "label": "Polygon"
 },
 "class": "HotspotPanoramaOverlay",
 "useHandCursor": true,
 "id": "overlay_777038C2_6064_91EF_41C9_8A7E7E14B24C",
 "maps": [
  {
   "hfov": 90,
   "yaw": 0,
   "image": {
    "levels": [
     {
      "url": "media/panorama_2669B134_2C3F_DDCB_41BB_88BE90D98D45_0_HS_4_1_0_map.gif",
      "width": 200,
      "height": 200,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": 0,
   "class": "HotspotPanoramaOverlayMap"
  },
  {
   "hfov": 90,
   "yaw": 90,
   "image": {
    "levels": [
     {
      "url": "media/panorama_2669B134_2C3F_DDCB_41BB_88BE90D98D45_0_HS_4_2_1_map.gif",
      "width": 200,
      "height": 200,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": 0,
   "class": "HotspotPanoramaOverlayMap"
  },
  {
   "hfov": 90,
   "yaw": -180,
   "image": {
    "levels": [
     {
      "url": "media/panorama_2669B134_2C3F_DDCB_41BB_88BE90D98D45_0_HS_4_3_2_map.gif",
      "width": 200,
      "height": 200,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": 0,
   "class": "HotspotPanoramaOverlayMap"
  },
  {
   "hfov": 90,
   "yaw": 0,
   "image": {
    "levels": [
     {
      "url": "media/panorama_2669B134_2C3F_DDCB_41BB_88BE90D98D45_0_HS_4_4_4_map.gif",
      "width": 200,
      "height": 200,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": 90,
   "class": "HotspotPanoramaOverlayMap"
  }
 ]
},
{
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "items": [
  {
   "hfov": 12.42,
   "image": "this.AnimatedImageResource_7B48F026_607C_B0B6_41CE_46EF7C031804",
   "pitch": -23.37,
   "yaw": 102.27,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "useHandCursor": true,
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_77EFC4AB_606B_91BE_41B1_6F226DEC80CC",
 "data": {
  "label": "Circle Point 02c"
 },
 "maps": [
  {
   "hfov": 12.42,
   "yaw": 102.27,
   "image": {
    "levels": [
     {
      "url": "media/panorama_2669B134_2C3F_DDCB_41BB_88BE90D98D45_0_HS_5_0_6_map.gif",
      "width": 27,
      "height": 16,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -23.37,
   "class": "HotspotPanoramaOverlayMap"
  }
 ]
},
{
 "rotate": false,
 "angle": 0,
 "image": {
  "levels": [
   {
    "url": "media/panorama_2650731A_2C3C_7DFF_41BF_42020C9917DD_tcap0.png",
    "width": 500,
    "height": 500,
    "class": "ImageResourceLevel"
   }
  ],
  "class": "ImageResource"
 },
 "class": "TripodCapPanoramaOverlay",
 "hfov": 45,
 "id": "panorama_2669B134_2C3F_DDCB_41BB_88BE90D98D45_tcap0",
 "distance": 50,
 "inertia": false
},
{
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_26667DFA_2C3C_443C_41B2_332913C8F61A, this.camera_87DACD2E_AF0B_6732_41D4_93C9A58EC417); this.mainPlayList.set('selectedIndex', 14)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "data": {
  "label": "Polygon"
 },
 "class": "HotspotPanoramaOverlay",
 "useHandCursor": true,
 "id": "overlay_4CC5D659_55BA_6848_41B2_6C5044108AD3",
 "maps": [
  {
   "hfov": 90,
   "yaw": 0,
   "image": {
    "levels": [
     {
      "url": "media/panorama_266A7DB6_2C3C_4437_41C1_235AEE268532_0_HS_0_1_0_map.gif",
      "width": 200,
      "height": 200,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": 0,
   "class": "HotspotPanoramaOverlayMap"
  },
  {
   "hfov": 90,
   "yaw": -180,
   "image": {
    "levels": [
     {
      "url": "media/panorama_266A7DB6_2C3C_4437_41C1_235AEE268532_0_HS_0_2_2_map.gif",
      "width": 200,
      "height": 200,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": 0,
   "class": "HotspotPanoramaOverlayMap"
  },
  {
   "hfov": 90,
   "yaw": -90,
   "image": {
    "levels": [
     {
      "url": "media/panorama_266A7DB6_2C3C_4437_41C1_235AEE268532_0_HS_0_3_3_map.gif",
      "width": 200,
      "height": 200,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": 0,
   "class": "HotspotPanoramaOverlayMap"
  },
  {
   "hfov": 90,
   "yaw": 0,
   "image": {
    "levels": [
     {
      "url": "media/panorama_266A7DB6_2C3C_4437_41C1_235AEE268532_0_HS_0_4_4_map.gif",
      "width": 200,
      "height": 200,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": 90,
   "class": "HotspotPanoramaOverlayMap"
  },
  {
   "hfov": 90,
   "yaw": 0,
   "image": {
    "levels": [
     {
      "url": "media/panorama_266A7DB6_2C3C_4437_41C1_235AEE268532_0_HS_0_5_5_map.gif",
      "width": 200,
      "height": 200,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -90,
   "class": "HotspotPanoramaOverlayMap"
  }
 ]
},
{
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "items": [
  {
   "hfov": 11.57,
   "image": "this.AnimatedImageResource_B4D8B9D4_AF0A_AF16_41BE_BAFFC86D4413",
   "pitch": -16.05,
   "yaw": -87.61,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "useHandCursor": true,
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_4C4BD8FA_55BB_D84B_41BE_3B4E9B860D25",
 "data": {
  "label": "Circle Point 02c"
 },
 "maps": [
  {
   "hfov": 11.57,
   "yaw": -87.61,
   "image": {
    "levels": [
     {
      "url": "media/panorama_266A7DB6_2C3C_4437_41C1_235AEE268532_0_HS_1_0_6_map.gif",
      "width": 27,
      "height": 16,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -16.05,
   "class": "HotspotPanoramaOverlayMap"
  }
 ]
},
{
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_2669A39A_2C3C_5CFF_41C0_F596914DA092, this.camera_87C4CD23_AF0B_6732_41CD_839C86A94DA2); this.mainPlayList.set('selectedIndex', 19)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "data": {
  "label": "Polygon"
 },
 "class": "HotspotPanoramaOverlay",
 "useHandCursor": true,
 "id": "overlay_4CF75034_55BA_A7DF_41A0_DFF011EE48D5",
 "maps": [
  {
   "hfov": 129.18,
   "yaw": 88.05,
   "image": {
    "levels": [
     {
      "url": "media/panorama_266A7DB6_2C3C_4437_41C1_235AEE268532_0_HS_2_1_6_map.gif",
      "width": 200,
      "height": 85,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": 10.76,
   "class": "HotspotPanoramaOverlayMap"
  }
 ]
},
{
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "items": [
  {
   "hfov": 11.45,
   "image": "this.AnimatedImageResource_B4D8E9D5_AF0A_AF16_41DE_A57F56BE6983",
   "pitch": -20.17,
   "yaw": 77.58,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "useHandCursor": true,
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_4F1B8D0E_55B9_B9CB_41CC_DB1AF41B1939",
 "data": {
  "label": "Circle Point 02c"
 },
 "maps": [
  {
   "hfov": 11.45,
   "yaw": 77.58,
   "image": {
    "levels": [
     {
      "url": "media/panorama_266A7DB6_2C3C_4437_41C1_235AEE268532_0_HS_3_0_6_map.gif",
      "width": 27,
      "height": 16,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -20.17,
   "class": "HotspotPanoramaOverlayMap"
  }
 ]
},
{
 "rotate": false,
 "angle": 0,
 "image": {
  "levels": [
   {
    "url": "media/panorama_2650731A_2C3C_7DFF_41BF_42020C9917DD_tcap0.png",
    "width": 500,
    "height": 500,
    "class": "ImageResourceLevel"
   }
  ],
  "class": "ImageResource"
 },
 "class": "TripodCapPanoramaOverlay",
 "hfov": 45,
 "id": "panorama_266A7DB6_2C3C_4437_41C1_235AEE268532_tcap0",
 "distance": 50,
 "inertia": false
},
{
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_266AA6A9_2C3C_44DD_4132_A3FBEF2422DE, this.camera_87D5ED38_AF0B_671E_41E0_B35ACC9C5085); this.mainPlayList.set('selectedIndex', 29)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "data": {
  "label": "Polygon"
 },
 "class": "HotspotPanoramaOverlay",
 "useHandCursor": true,
 "id": "overlay_BAD6A5D8_AF07_671E_41C8_5D735AE6C7D9",
 "maps": [
  {
   "hfov": 89.19,
   "yaw": -6.53,
   "image": {
    "levels": [
     {
      "url": "media/panorama_266A7DB6_2C3C_4437_41C1_235AEE268532_0_HS_4_1_6_map.gif",
      "width": 183,
      "height": 200,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": 9.17,
   "class": "HotspotPanoramaOverlayMap"
  }
 ]
},
{
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "items": [
  {
   "hfov": 13.78,
   "image": "this.AnimatedImageResource_B4D839D7_AF0A_AF12_41E5_DB5CE1E0F900",
   "pitch": -33.06,
   "yaw": -7.26,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "useHandCursor": true,
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_B9AFBC6C_AF07_E536_41CA_45A5571314D2",
 "data": {
  "label": "Circle Point 02c"
 },
 "maps": [
  {
   "hfov": 13.78,
   "yaw": -7.26,
   "image": {
    "levels": [
     {
      "url": "media/panorama_266A7DB6_2C3C_4437_41C1_235AEE268532_0_HS_5_0_6_map.gif",
      "width": 27,
      "height": 16,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -33.06,
   "class": "HotspotPanoramaOverlayMap"
  }
 ]
},
{
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_26663B80_2C3C_4CCC_41C4_05539F545C2A, this.camera_86C8FE40_AF0B_656E_41D1_A752FD0B1841); this.mainPlayList.set('selectedIndex', 8)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "data": {
  "label": "Polygon"
 },
 "class": "HotspotPanoramaOverlay",
 "useHandCursor": true,
 "id": "overlay_59B3552C_5546_E9CE_41D1_2C3D7BD9C832",
 "maps": [
  {
   "hfov": 99.82,
   "yaw": -36.77,
   "image": {
    "levels": [
     {
      "url": "media/panorama_2666F3DA_2C3C_BC7F_41A5_8719A461067F_0_HS_0_1_0_map.gif",
      "width": 200,
      "height": 117,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": 7.47,
   "class": "HotspotPanoramaOverlayMap"
  }
 ]
},
{
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "items": [
  {
   "hfov": 9.75,
   "image": "this.AnimatedImageResource_432DF17C_554A_A84F_41CB_EE880CB935AF",
   "pitch": -14.5,
   "yaw": -10.82,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "useHandCursor": true,
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_45736F36_555A_59DB_41CB_477BFB29AF13",
 "data": {
  "label": "Circle Point 02c"
 },
 "maps": [
  {
   "hfov": 9.75,
   "yaw": -10.82,
   "image": {
    "levels": [
     {
      "url": "media/panorama_2666F3DA_2C3C_BC7F_41A5_8719A461067F_0_HS_1_0_0_map.gif",
      "width": 27,
      "height": 16,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -14.5,
   "class": "HotspotPanoramaOverlayMap"
  }
 ]
},
{
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_2666CCAC_2C3C_C4D4_41B6_6F5BD1BACD46, this.camera_86E51E2A_AF0B_6532_41DF_5F98FEDC432E); this.mainPlayList.set('selectedIndex', 6)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "data": {
  "label": "Polygon"
 },
 "class": "HotspotPanoramaOverlay",
 "useHandCursor": true,
 "id": "overlay_45929DC6_555A_58BA_419A_6D34E108DEB2",
 "maps": [
  {
   "hfov": 71.45,
   "yaw": 145.46,
   "image": {
    "levels": [
     {
      "url": "media/panorama_2666F3DA_2C3C_BC7F_41A5_8719A461067F_0_HS_2_1_0_map.gif",
      "width": 200,
      "height": 181,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -3.67,
   "class": "HotspotPanoramaOverlayMap"
  }
 ]
},
{
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_2666CCAC_2C3C_C4D4_41B6_6F5BD1BACD46, this.camera_86FE2E35_AF0B_6516_41DD_73457641BB7F); this.mainPlayList.set('selectedIndex', 6)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "data": {
  "label": "Polygon"
 },
 "class": "HotspotPanoramaOverlay",
 "useHandCursor": true,
 "id": "overlay_44B9D83F_555E_67C9_41C8_10FD1E21AC60",
 "maps": [
  {
   "hfov": 68.28,
   "yaw": -146.71,
   "image": {
    "levels": [
     {
      "url": "media/panorama_2666F3DA_2C3C_BC7F_41A5_8719A461067F_0_HS_3_1_0_map.gif",
      "width": 200,
      "height": 155,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": 4.78,
   "class": "HotspotPanoramaOverlayMap"
  }
 ]
},
{
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "items": [
  {
   "hfov": 14.16,
   "image": "this.AnimatedImageResource_41B1D533_5546_A9D9_41B9_E8E05922A272",
   "pitch": -28.94,
   "yaw": 171.1,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "useHandCursor": true,
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_411EE496_554A_68DA_41C5_B68ADB1D6FE6",
 "data": {
  "label": "Circle Point 02c"
 },
 "maps": [
  {
   "hfov": 14.16,
   "yaw": 171.1,
   "image": {
    "levels": [
     {
      "url": "media/panorama_2666F3DA_2C3C_BC7F_41A5_8719A461067F_0_HS_5_0_0_map.gif",
      "width": 27,
      "height": 16,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -28.94,
   "class": "HotspotPanoramaOverlayMap"
  }
 ]
},
{
 "rotate": false,
 "angle": 0,
 "image": {
  "levels": [
   {
    "url": "media/panorama_2650731A_2C3C_7DFF_41BF_42020C9917DD_tcap0.png",
    "width": 500,
    "height": 500,
    "class": "ImageResourceLevel"
   }
  ],
  "class": "ImageResource"
 },
 "class": "TripodCapPanoramaOverlay",
 "hfov": 45,
 "id": "panorama_2666F3DA_2C3C_BC7F_41A5_8719A461067F_tcap0",
 "distance": 50,
 "inertia": false
},
{
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_266A48C5_2C3C_4C55_41B3_1D70C2050903, this.camera_87B26D58_AF0B_671E_41D8_2939C936F3A1); this.mainPlayList.set('selectedIndex', 3)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "data": {
  "label": "Polygon"
 },
 "class": "HotspotPanoramaOverlay",
 "useHandCursor": true,
 "id": "overlay_3F0A7D94_2C44_44F4_419A_DD2368472762",
 "maps": [
  {
   "hfov": 93.08,
   "yaw": 133.9,
   "image": {
    "levels": [
     {
      "url": "media/panorama_26667EAB_2C3C_44DC_41BD_508AF18BD0E5_0_HS_0_1_0_map.gif",
      "width": 200,
      "height": 95,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": 6.74,
   "class": "HotspotPanoramaOverlayMap"
  }
 ]
},
{
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "items": [
  {
   "hfov": 12.62,
   "image": "this.AnimatedImageResource_39FD82E1_2C3D_FC4D_418D_C2583A2D9F7D",
   "pitch": -11.25,
   "yaw": 154.06,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "useHandCursor": true,
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_3A37B823_2C44_4BCD_41B0_EFAE159307E0",
 "data": {
  "label": "Circle Point 02c"
 },
 "maps": [
  {
   "hfov": 12.62,
   "yaw": 154.06,
   "image": {
    "levels": [
     {
      "url": "media/panorama_26667EAB_2C3C_44DC_41BD_508AF18BD0E5_0_HS_1_0_0_map.gif",
      "width": 27,
      "height": 16,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -11.25,
   "class": "HotspotPanoramaOverlayMap"
  }
 ]
},
{
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_274E4A2E_2C3D_CFD7_41C3_E749466BFD9F, this.camera_87B96D4D_AF0B_6771_41E2_77D65187F622); this.mainPlayList.set('selectedIndex', 1)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "data": {
  "label": "Polygon"
 },
 "class": "HotspotPanoramaOverlay",
 "useHandCursor": true,
 "id": "overlay_387C65FD_2C3C_4434_41C5_237ACFD61079",
 "maps": [
  {
   "hfov": 90,
   "yaw": 0,
   "image": {
    "levels": [
     {
      "url": "media/panorama_26667EAB_2C3C_44DC_41BD_508AF18BD0E5_0_HS_2_1_0_map.gif",
      "width": 200,
      "height": 200,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": 0,
   "class": "HotspotPanoramaOverlayMap"
  },
  {
   "hfov": 90,
   "yaw": 90,
   "image": {
    "levels": [
     {
      "url": "media/panorama_26667EAB_2C3C_44DC_41BD_508AF18BD0E5_0_HS_2_2_1_map.gif",
      "width": 200,
      "height": 200,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": 0,
   "class": "HotspotPanoramaOverlayMap"
  },
  {
   "hfov": 90,
   "yaw": -90,
   "image": {
    "levels": [
     {
      "url": "media/panorama_26667EAB_2C3C_44DC_41BD_508AF18BD0E5_0_HS_2_3_3_map.gif",
      "width": 200,
      "height": 200,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": 0,
   "class": "HotspotPanoramaOverlayMap"
  },
  {
   "hfov": 90,
   "yaw": 0,
   "image": {
    "levels": [
     {
      "url": "media/panorama_26667EAB_2C3C_44DC_41BD_508AF18BD0E5_0_HS_2_4_4_map.gif",
      "width": 200,
      "height": 200,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": 90,
   "class": "HotspotPanoramaOverlayMap"
  },
  {
   "hfov": 90,
   "yaw": 0,
   "image": {
    "levels": [
     {
      "url": "media/panorama_26667EAB_2C3C_44DC_41BD_508AF18BD0E5_0_HS_2_5_5_map.gif",
      "width": 200,
      "height": 200,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -90,
   "class": "HotspotPanoramaOverlayMap"
  }
 ]
},
{
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "items": [
  {
   "hfov": 10.34,
   "image": "this.AnimatedImageResource_3905BD79_2C3F_C43C_41AA_AD2C74CC4FE5",
   "pitch": -26.01,
   "yaw": -18.93,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "useHandCursor": true,
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_38CB08EC_2C3C_CC5B_41B5_5C69CB79D9AD",
 "data": {
  "label": "Circle Point 02c"
 },
 "maps": [
  {
   "hfov": 10.34,
   "yaw": -18.93,
   "image": {
    "levels": [
     {
      "url": "media/panorama_26667EAB_2C3C_44DC_41BD_508AF18BD0E5_0_HS_3_0_6_map.gif",
      "width": 27,
      "height": 16,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -26.01,
   "class": "HotspotPanoramaOverlayMap"
  }
 ]
},
{
 "rotate": false,
 "angle": 0,
 "image": {
  "levels": [
   {
    "url": "media/panorama_2650731A_2C3C_7DFF_41BF_42020C9917DD_tcap0.png",
    "width": 500,
    "height": 500,
    "class": "ImageResourceLevel"
   }
  ],
  "class": "ImageResource"
 },
 "class": "TripodCapPanoramaOverlay",
 "hfov": 45,
 "id": "panorama_26667EAB_2C3C_44DC_41BD_508AF18BD0E5_tcap0",
 "distance": 50,
 "inertia": false
},
{
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_266ACC21_2C3C_CBCD_41B6_407672D395B3, this.camera_86265EF5_AF0B_6516_41D0_6A01BC4FFE18); this.mainPlayList.set('selectedIndex', 16)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "data": {
  "label": "Polygon"
 },
 "class": "HotspotPanoramaOverlay",
 "useHandCursor": true,
 "id": "overlay_412B20FE_60DD_9196_41D7_20CFB232AE66",
 "maps": [
  {
   "hfov": 90,
   "yaw": 0,
   "image": {
    "levels": [
     {
      "url": "media/panorama_266A4FDB_2C3C_447D_41C1_296818159F21_0_HS_0_1_0_map.gif",
      "width": 200,
      "height": 200,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": 0,
   "class": "HotspotPanoramaOverlayMap"
  },
  {
   "hfov": 90,
   "yaw": -180,
   "image": {
    "levels": [
     {
      "url": "media/panorama_266A4FDB_2C3C_447D_41C1_296818159F21_0_HS_0_2_2_map.gif",
      "width": 200,
      "height": 200,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": 0,
   "class": "HotspotPanoramaOverlayMap"
  },
  {
   "hfov": 90,
   "yaw": -90,
   "image": {
    "levels": [
     {
      "url": "media/panorama_266A4FDB_2C3C_447D_41C1_296818159F21_0_HS_0_3_3_map.gif",
      "width": 200,
      "height": 200,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": 0,
   "class": "HotspotPanoramaOverlayMap"
  },
  {
   "hfov": 90,
   "yaw": 0,
   "image": {
    "levels": [
     {
      "url": "media/panorama_266A4FDB_2C3C_447D_41C1_296818159F21_0_HS_0_4_4_map.gif",
      "width": 200,
      "height": 200,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": 90,
   "class": "HotspotPanoramaOverlayMap"
  },
  {
   "hfov": 90,
   "yaw": 0,
   "image": {
    "levels": [
     {
      "url": "media/panorama_266A4FDB_2C3C_447D_41C1_296818159F21_0_HS_0_5_5_map.gif",
      "width": 200,
      "height": 200,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -90,
   "class": "HotspotPanoramaOverlayMap"
  }
 ]
},
{
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "items": [
  {
   "hfov": 13.78,
   "image": "this.AnimatedImageResource_46A272F9_60EF_919A_41D3_FF32345C4B3C",
   "pitch": -33.55,
   "yaw": -94.07,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "useHandCursor": true,
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_42A671E9_60DC_93BA_41D4_7D7658E38488",
 "data": {
  "label": "Circle Point 02c"
 },
 "maps": [
  {
   "hfov": 13.78,
   "yaw": -94.07,
   "image": {
    "levels": [
     {
      "url": "media/panorama_266A4FDB_2C3C_447D_41C1_296818159F21_0_HS_1_0_6_map.gif",
      "width": 27,
      "height": 16,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -33.55,
   "class": "HotspotPanoramaOverlayMap"
  }
 ]
},
{
 "rotate": false,
 "angle": 0,
 "image": {
  "levels": [
   {
    "url": "media/panorama_2650731A_2C3C_7DFF_41BF_42020C9917DD_tcap0.png",
    "width": 500,
    "height": 500,
    "class": "ImageResourceLevel"
   }
  ],
  "class": "ImageResource"
 },
 "class": "TripodCapPanoramaOverlay",
 "hfov": 45,
 "id": "panorama_266A4FDB_2C3C_447D_41C1_296818159F21_tcap0",
 "distance": 50,
 "inertia": false
},
{
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_266A40B1_2C3C_7CCD_41B2_B5FCEE869E17, this.camera_85865F84_AF0B_63F6_41E3_CC04EFB093B9); this.mainPlayList.set('selectedIndex', 13)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "data": {
  "label": "Polygon"
 },
 "class": "HotspotPanoramaOverlay",
 "useHandCursor": true,
 "id": "overlay_400A112D_60DC_90BA_41A0_747940A4E655",
 "maps": [
  {
   "hfov": 90,
   "yaw": 0,
   "image": {
    "levels": [
     {
      "url": "media/panorama_266A5334_2C3C_BDCB_41C0_5ECFC0F03DE9_0_HS_0_1_0_map.gif",
      "width": 200,
      "height": 200,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": 0,
   "class": "HotspotPanoramaOverlayMap"
  },
  {
   "hfov": 90,
   "yaw": 90,
   "image": {
    "levels": [
     {
      "url": "media/panorama_266A5334_2C3C_BDCB_41C0_5ECFC0F03DE9_0_HS_0_2_1_map.gif",
      "width": 200,
      "height": 200,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": 0,
   "class": "HotspotPanoramaOverlayMap"
  },
  {
   "hfov": 90,
   "yaw": -90,
   "image": {
    "levels": [
     {
      "url": "media/panorama_266A5334_2C3C_BDCB_41C0_5ECFC0F03DE9_0_HS_0_3_3_map.gif",
      "width": 200,
      "height": 200,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": 0,
   "class": "HotspotPanoramaOverlayMap"
  },
  {
   "hfov": 90,
   "yaw": 0,
   "image": {
    "levels": [
     {
      "url": "media/panorama_266A5334_2C3C_BDCB_41C0_5ECFC0F03DE9_0_HS_0_4_4_map.gif",
      "width": 200,
      "height": 200,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": 90,
   "class": "HotspotPanoramaOverlayMap"
  },
  {
   "hfov": 90,
   "yaw": 0,
   "image": {
    "levels": [
     {
      "url": "media/panorama_266A5334_2C3C_BDCB_41C0_5ECFC0F03DE9_0_HS_0_5_5_map.gif",
      "width": 200,
      "height": 200,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -90,
   "class": "HotspotPanoramaOverlayMap"
  }
 ]
},
{
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "items": [
  {
   "hfov": 18.93,
   "image": "this.AnimatedImageResource_46ACA2F8_60EF_919A_41D3_C048FE8FFDE1",
   "pitch": -28.08,
   "yaw": -7.8,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "useHandCursor": true,
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_41621FBB_60DC_8F9D_41D7_B64E8E7928AD",
 "data": {
  "label": "Circle Point 02c"
 },
 "maps": [
  {
   "hfov": 18.93,
   "yaw": -7.8,
   "image": {
    "levels": [
     {
      "url": "media/panorama_266A5334_2C3C_BDCB_41C0_5ECFC0F03DE9_0_HS_1_0_6_map.gif",
      "width": 27,
      "height": 16,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -28.08,
   "class": "HotspotPanoramaOverlayMap"
  }
 ]
},
{
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_266ACC21_2C3C_CBCD_41B6_407672D395B3, this.camera_858AAF6D_AF0B_6336_41E5_B6C643F9FE61); this.mainPlayList.set('selectedIndex', 16)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "data": {
  "label": "Polygon"
 },
 "class": "HotspotPanoramaOverlay",
 "useHandCursor": true,
 "id": "overlay_4129BE12_60DF_906F_41CD_05918313E09C",
 "maps": [
  {
   "hfov": 78.09,
   "yaw": 143.07,
   "image": {
    "levels": [
     {
      "url": "media/panorama_266A5334_2C3C_BDCB_41C0_5ECFC0F03DE9_0_HS_2_1_0_map.gif",
      "width": 189,
      "height": 200,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -5.39,
   "class": "HotspotPanoramaOverlayMap"
  }
 ]
},
{
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "items": [
  {
   "hfov": 12.26,
   "image": "this.AnimatedImageResource_46AD22F8_60EF_919A_4151_A5053AD75BB8",
   "pitch": -35.02,
   "yaw": 169.13,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "useHandCursor": true,
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_41A24EA7_60DC_F1B6_41C9_4F60C856A503",
 "data": {
  "label": "Circle Point 02c"
 },
 "maps": [
  {
   "hfov": 12.26,
   "yaw": 169.13,
   "image": {
    "levels": [
     {
      "url": "media/panorama_266A5334_2C3C_BDCB_41C0_5ECFC0F03DE9_0_HS_3_0_6_map.gif",
      "width": 27,
      "height": 16,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -35.02,
   "class": "HotspotPanoramaOverlayMap"
  }
 ]
},
{
 "rotate": false,
 "angle": 0,
 "image": {
  "levels": [
   {
    "url": "media/panorama_2650731A_2C3C_7DFF_41BF_42020C9917DD_tcap0.png",
    "width": 500,
    "height": 500,
    "class": "ImageResourceLevel"
   }
  ],
  "class": "ImageResource"
 },
 "class": "TripodCapPanoramaOverlay",
 "hfov": 45,
 "id": "panorama_266A5334_2C3C_BDCB_41C0_5ECFC0F03DE9_tcap0",
 "distance": 50,
 "inertia": false
},
{
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_26664293_2C3C_5CCD_41B6_BA5F5C9DBD4C, this.camera_86283EEA_AF0B_6532_41DA_924D1E91A9B5); this.mainPlayList.set('selectedIndex', 9)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "data": {
  "label": "Polygon"
 },
 "class": "HotspotPanoramaOverlay",
 "useHandCursor": true,
 "id": "overlay_7AE2CCD7_606D_B195_41CB_EA6452F88F36",
 "maps": [
  {
   "hfov": 90,
   "yaw": 0,
   "image": {
    "levels": [
     {
      "url": "media/panorama_2666F540_2C3C_C44C_41C0_1FA76F1EECB2_0_HS_0_1_0_map.gif",
      "width": 200,
      "height": 200,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": 0,
   "class": "HotspotPanoramaOverlayMap"
  },
  {
   "hfov": 90,
   "yaw": -180,
   "image": {
    "levels": [
     {
      "url": "media/panorama_2666F540_2C3C_C44C_41C0_1FA76F1EECB2_0_HS_0_2_2_map.gif",
      "width": 200,
      "height": 200,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": 0,
   "class": "HotspotPanoramaOverlayMap"
  },
  {
   "hfov": 90,
   "yaw": -90,
   "image": {
    "levels": [
     {
      "url": "media/panorama_2666F540_2C3C_C44C_41C0_1FA76F1EECB2_0_HS_0_3_3_map.gif",
      "width": 200,
      "height": 200,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": 0,
   "class": "HotspotPanoramaOverlayMap"
  },
  {
   "hfov": 90,
   "yaw": 0,
   "image": {
    "levels": [
     {
      "url": "media/panorama_2666F540_2C3C_C44C_41C0_1FA76F1EECB2_0_HS_0_4_4_map.gif",
      "width": 200,
      "height": 200,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": 90,
   "class": "HotspotPanoramaOverlayMap"
  },
  {
   "hfov": 90,
   "yaw": 0,
   "image": {
    "levels": [
     {
      "url": "media/panorama_2666F540_2C3C_C44C_41C0_1FA76F1EECB2_0_HS_0_5_5_map.gif",
      "width": 200,
      "height": 200,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -90,
   "class": "HotspotPanoramaOverlayMap"
  }
 ]
},
{
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "items": [
  {
   "hfov": 17.9,
   "image": "this.AnimatedImageResource_7E726AEC_605D_91BA_41C9_70EB44E1BCCD",
   "pitch": -33.23,
   "yaw": 118.7,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "useHandCursor": true,
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_7A9E887E_606D_B096_41CC_317E8FAD0BBF",
 "data": {
  "label": "Circle Point 02c"
 },
 "maps": [
  {
   "hfov": 17.9,
   "yaw": 118.7,
   "image": {
    "levels": [
     {
      "url": "media/panorama_2666F540_2C3C_C44C_41C0_1FA76F1EECB2_0_HS_1_0_6_map.gif",
      "width": 27,
      "height": 16,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -33.23,
   "class": "HotspotPanoramaOverlayMap"
  }
 ]
},
{
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_26660E76_2C3C_C437_41C0_4932F3D787B3, this.camera_865A5EDF_AF0B_6512_41CD_9A46C109C6B6); this.mainPlayList.set('selectedIndex', 11)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "data": {
  "label": "Polygon"
 },
 "class": "HotspotPanoramaOverlay",
 "useHandCursor": true,
 "id": "overlay_7CCBD0E2_606C_91AE_41CF_E294FC9315A7",
 "maps": [
  {
   "hfov": 90,
   "yaw": 0,
   "image": {
    "levels": [
     {
      "url": "media/panorama_2666F540_2C3C_C44C_41C0_1FA76F1EECB2_0_HS_2_1_0_map.gif",
      "width": 200,
      "height": 200,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": 0,
   "class": "HotspotPanoramaOverlayMap"
  },
  {
   "hfov": 90,
   "yaw": -180,
   "image": {
    "levels": [
     {
      "url": "media/panorama_2666F540_2C3C_C44C_41C0_1FA76F1EECB2_0_HS_2_2_2_map.gif",
      "width": 200,
      "height": 200,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": 0,
   "class": "HotspotPanoramaOverlayMap"
  },
  {
   "hfov": 90,
   "yaw": -90,
   "image": {
    "levels": [
     {
      "url": "media/panorama_2666F540_2C3C_C44C_41C0_1FA76F1EECB2_0_HS_2_3_3_map.gif",
      "width": 200,
      "height": 200,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": 0,
   "class": "HotspotPanoramaOverlayMap"
  },
  {
   "hfov": 90,
   "yaw": 0,
   "image": {
    "levels": [
     {
      "url": "media/panorama_2666F540_2C3C_C44C_41C0_1FA76F1EECB2_0_HS_2_4_4_map.gif",
      "width": 200,
      "height": 200,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": 90,
   "class": "HotspotPanoramaOverlayMap"
  },
  {
   "hfov": 90,
   "yaw": 0,
   "image": {
    "levels": [
     {
      "url": "media/panorama_2666F540_2C3C_C44C_41C0_1FA76F1EECB2_0_HS_2_5_5_map.gif",
      "width": 200,
      "height": 200,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -90,
   "class": "HotspotPanoramaOverlayMap"
  }
 ]
},
{
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "items": [
  {
   "hfov": 17.71,
   "image": "this.AnimatedImageResource_7E72CAEE_605D_91B7_41D6_B89D863B1BB6",
   "pitch": -23.23,
   "yaw": -62,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "useHandCursor": true,
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_7AA844EB_606F_91BE_41C8_0200A57B9262",
 "data": {
  "label": "Circle Point 02c"
 },
 "maps": [
  {
   "hfov": 17.71,
   "yaw": -62,
   "image": {
    "levels": [
     {
      "url": "media/panorama_2666F540_2C3C_C44C_41C0_1FA76F1EECB2_0_HS_3_0_6_map.gif",
      "width": 27,
      "height": 16,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -23.23,
   "class": "HotspotPanoramaOverlayMap"
  }
 ]
},
{
 "rotate": false,
 "angle": 0,
 "image": {
  "levels": [
   {
    "url": "media/panorama_2650731A_2C3C_7DFF_41BF_42020C9917DD_tcap0.png",
    "width": 500,
    "height": 500,
    "class": "ImageResourceLevel"
   }
  ],
  "class": "ImageResource"
 },
 "class": "TripodCapPanoramaOverlay",
 "hfov": 45,
 "id": "panorama_2666F540_2C3C_C44C_41C0_1FA76F1EECB2_tcap0",
 "distance": 50,
 "inertia": false
},
{
 "rotate": false,
 "angle": 0,
 "image": {
  "levels": [
   {
    "url": "media/panorama_2650731A_2C3C_7DFF_41BF_42020C9917DD_tcap0.png",
    "width": 500,
    "height": 500,
    "class": "ImageResourceLevel"
   }
  ],
  "class": "ImageResource"
 },
 "class": "TripodCapPanoramaOverlay",
 "hfov": 45,
 "id": "panorama_266AA6A9_2C3C_44DD_4132_A3FBEF2422DE_tcap0",
 "distance": 50,
 "inertia": false
},
{
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_266A7DB6_2C3C_4437_41C1_235AEE268532, this.camera_86EB7E1E_AF0B_6512_41CC_3E5900F4D50C); this.mainPlayList.set('selectedIndex', 18)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "data": {
  "label": "Polygon"
 },
 "class": "HotspotPanoramaOverlay",
 "useHandCursor": true,
 "id": "overlay_B7D02137_AF0A_DF12_41D1_4F7699CEC4B6",
 "maps": [
  {
   "hfov": 101.33,
   "yaw": 137.29,
   "image": {
    "levels": [
     {
      "url": "media/panorama_266AA6A9_2C3C_44DD_4132_A3FBEF2422DE_0_HS_0_1_0_map.gif",
      "width": 131,
      "height": 200,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -10.29,
   "class": "HotspotPanoramaOverlayMap"
  }
 ]
},
{
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "items": [
  {
   "hfov": 15.34,
   "image": "this.AnimatedImageResource_B37FB8A9_AF09_AD3E_41E3_FA1CA5354793",
   "pitch": -17.18,
   "yaw": 165.02,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "useHandCursor": true,
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_B62A6EEB_AF09_E532_41C0_D5E940A1D547",
 "data": {
  "label": "Circle Point 02c"
 },
 "maps": [
  {
   "hfov": 15.34,
   "yaw": 165.02,
   "image": {
    "levels": [
     {
      "url": "media/panorama_266AA6A9_2C3C_44DD_4132_A3FBEF2422DE_0_HS_1_0_0_map.gif",
      "width": 27,
      "height": 16,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -17.18,
   "class": "HotspotPanoramaOverlayMap"
  }
 ]
},
{
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_266ABC73_2C3C_444D_41A2_D12FEAAC1356, this.camera_871E5E11_AF0B_64EE_41E0_B1B1F7AEC214); this.mainPlayList.set('selectedIndex', 28)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "data": {
  "label": "Polygon"
 },
 "class": "HotspotPanoramaOverlay",
 "useHandCursor": true,
 "id": "overlay_B7C6B698_AF06_E51E_41E4_4046469B8F92",
 "maps": [
  {
   "hfov": 90,
   "yaw": 0,
   "image": {
    "levels": [
     {
      "url": "media/panorama_266AA6A9_2C3C_44DD_4132_A3FBEF2422DE_0_HS_2_1_0_map.gif",
      "width": 200,
      "height": 200,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": 0,
   "class": "HotspotPanoramaOverlayMap"
  },
  {
   "hfov": 90,
   "yaw": 90,
   "image": {
    "levels": [
     {
      "url": "media/panorama_266AA6A9_2C3C_44DD_4132_A3FBEF2422DE_0_HS_2_2_1_map.gif",
      "width": 200,
      "height": 200,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": 0,
   "class": "HotspotPanoramaOverlayMap"
  },
  {
   "hfov": 90,
   "yaw": -90,
   "image": {
    "levels": [
     {
      "url": "media/panorama_266AA6A9_2C3C_44DD_4132_A3FBEF2422DE_0_HS_2_3_3_map.gif",
      "width": 200,
      "height": 200,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": 0,
   "class": "HotspotPanoramaOverlayMap"
  },
  {
   "hfov": 90,
   "yaw": 0,
   "image": {
    "levels": [
     {
      "url": "media/panorama_266AA6A9_2C3C_44DD_4132_A3FBEF2422DE_0_HS_2_4_4_map.gif",
      "width": 200,
      "height": 200,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": 90,
   "class": "HotspotPanoramaOverlayMap"
  },
  {
   "hfov": 90,
   "yaw": 0,
   "image": {
    "levels": [
     {
      "url": "media/panorama_266AA6A9_2C3C_44DD_4132_A3FBEF2422DE_0_HS_2_5_5_map.gif",
      "width": 200,
      "height": 200,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -90,
   "class": "HotspotPanoramaOverlayMap"
  }
 ]
},
{
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "items": [
  {
   "hfov": 11.81,
   "image": "this.AnimatedImageResource_B30F8C23_AF3A_A532_41D8_F8EE9845B78E",
   "pitch": -29.73,
   "yaw": -4.24,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "useHandCursor": true,
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_B3A6BB0B_AF09_ACF2_41D1_2DD6DD21AA73",
 "data": {
  "label": "Circle Point 02c"
 },
 "maps": [
  {
   "hfov": 11.81,
   "yaw": -4.24,
   "image": {
    "levels": [
     {
      "url": "media/panorama_266AA6A9_2C3C_44DD_4132_A3FBEF2422DE_0_HS_3_0_6_map.gif",
      "width": 27,
      "height": 16,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -29.73,
   "class": "HotspotPanoramaOverlayMap"
  }
 ]
},
{
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "class": "HotspotPanoramaOverlay",
 "useHandCursor": true,
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_B2D68551_AF1A_A76E_41E2_A9046EE11187",
 "data": {
  "label": "Polygon"
 },
 "maps": [
  {
   "hfov": 90,
   "yaw": -180,
   "image": {
    "levels": [
     {
      "url": "media/panorama_266AA6A9_2C3C_44DD_4132_A3FBEF2422DE_0_HS_4_1_2_map.gif",
      "width": 200,
      "height": 200,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": 0,
   "class": "HotspotPanoramaOverlayMap"
  },
  {
   "hfov": 90,
   "yaw": -90,
   "image": {
    "levels": [
     {
      "url": "media/panorama_266AA6A9_2C3C_44DD_4132_A3FBEF2422DE_0_HS_4_2_3_map.gif",
      "width": 200,
      "height": 200,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": 0,
   "class": "HotspotPanoramaOverlayMap"
  },
  {
   "hfov": 90,
   "yaw": 0,
   "image": {
    "levels": [
     {
      "url": "media/panorama_266AA6A9_2C3C_44DD_4132_A3FBEF2422DE_0_HS_4_3_4_map.gif",
      "width": 200,
      "height": 200,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": 90,
   "class": "HotspotPanoramaOverlayMap"
  },
  {
   "hfov": 90,
   "yaw": 0,
   "image": {
    "levels": [
     {
      "url": "media/panorama_266AA6A9_2C3C_44DD_4132_A3FBEF2422DE_0_HS_4_4_5_map.gif",
      "width": 200,
      "height": 200,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -90,
   "class": "HotspotPanoramaOverlayMap"
  }
 ]
},
{
 "rotate": false,
 "angle": 0,
 "image": {
  "levels": [
   {
    "url": "media/panorama_2650731A_2C3C_7DFF_41BF_42020C9917DD_tcap0.png",
    "width": 500,
    "height": 500,
    "class": "ImageResourceLevel"
   }
  ],
  "class": "ImageResource"
 },
 "class": "TripodCapPanoramaOverlay",
 "hfov": 45,
 "id": "panorama_26661FEC_2C3C_C45B_419B_861471116CC7_tcap0",
 "distance": 50,
 "inertia": false
},
{
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_26666712_2C3C_C5CF_4198_822E2A8C8DCC, this.camera_878C1D64_AF0B_6736_41D1_562EE355EF7F); this.mainPlayList.set('selectedIndex', 32)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "data": {
  "label": "Polygon"
 },
 "class": "HotspotPanoramaOverlay",
 "useHandCursor": true,
 "id": "overlay_8D7AF4D9_AF7A_E51E_4191_193976FC98E3",
 "maps": [
  {
   "hfov": 90,
   "yaw": 0,
   "image": {
    "levels": [
     {
      "url": "media/panorama_26661FEC_2C3C_C45B_419B_861471116CC7_0_HS_0_1_0_map.gif",
      "width": 200,
      "height": 200,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": 0,
   "class": "HotspotPanoramaOverlayMap"
  },
  {
   "hfov": 90,
   "yaw": 90,
   "image": {
    "levels": [
     {
      "url": "media/panorama_26661FEC_2C3C_C45B_419B_861471116CC7_0_HS_0_2_1_map.gif",
      "width": 200,
      "height": 200,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": 0,
   "class": "HotspotPanoramaOverlayMap"
  },
  {
   "hfov": 90,
   "yaw": -90,
   "image": {
    "levels": [
     {
      "url": "media/panorama_26661FEC_2C3C_C45B_419B_861471116CC7_0_HS_0_3_3_map.gif",
      "width": 200,
      "height": 200,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": 0,
   "class": "HotspotPanoramaOverlayMap"
  },
  {
   "hfov": 90,
   "yaw": 0,
   "image": {
    "levels": [
     {
      "url": "media/panorama_26661FEC_2C3C_C45B_419B_861471116CC7_0_HS_0_4_4_map.gif",
      "width": 200,
      "height": 200,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": 90,
   "class": "HotspotPanoramaOverlayMap"
  },
  {
   "hfov": 90,
   "yaw": 0,
   "image": {
    "levels": [
     {
      "url": "media/panorama_26661FEC_2C3C_C45B_419B_861471116CC7_0_HS_0_5_5_map.gif",
      "width": 200,
      "height": 200,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -90,
   "class": "HotspotPanoramaOverlayMap"
  }
 ]
},
{
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "items": [
  {
   "hfov": 12.62,
   "image": "this.AnimatedImageResource_8B5029B9_AF0A_AF1E_41DB_2AAE06DC11A2",
   "pitch": -21.11,
   "yaw": -0.69,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "useHandCursor": true,
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_8AAB8A2D_AF7B_6D36_41BC_22E3835FB9B6",
 "data": {
  "label": "Circle Point 02c"
 },
 "maps": [
  {
   "hfov": 12.62,
   "yaw": -0.69,
   "image": {
    "levels": [
     {
      "url": "media/panorama_26661FEC_2C3C_C45B_419B_861471116CC7_0_HS_1_0_6_map.gif",
      "width": 27,
      "height": 16,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -21.11,
   "class": "HotspotPanoramaOverlayMap"
  }
 ]
},
{
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_26663B80_2C3C_4CCC_41C4_05539F545C2A, this.camera_88338C75_AF0B_6516_41B5_C916C38ABABF); this.mainPlayList.set('selectedIndex', 8)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "data": {
  "label": "Polygon"
 },
 "class": "HotspotPanoramaOverlay",
 "useHandCursor": true,
 "id": "overlay_4362CC2A_5547_BFCB_41BB_5B5114774928",
 "maps": [
  {
   "hfov": 90,
   "yaw": 0,
   "image": {
    "levels": [
     {
      "url": "media/panorama_26664293_2C3C_5CCD_41B6_BA5F5C9DBD4C_0_HS_0_1_0_map.gif",
      "width": 200,
      "height": 200,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": 0,
   "class": "HotspotPanoramaOverlayMap"
  },
  {
   "hfov": 90,
   "yaw": -90,
   "image": {
    "levels": [
     {
      "url": "media/panorama_26664293_2C3C_5CCD_41B6_BA5F5C9DBD4C_0_HS_0_2_3_map.gif",
      "width": 200,
      "height": 200,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": 0,
   "class": "HotspotPanoramaOverlayMap"
  },
  {
   "hfov": 90,
   "yaw": 0,
   "image": {
    "levels": [
     {
      "url": "media/panorama_26664293_2C3C_5CCD_41B6_BA5F5C9DBD4C_0_HS_0_3_4_map.gif",
      "width": 200,
      "height": 200,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": 90,
   "class": "HotspotPanoramaOverlayMap"
  },
  {
   "hfov": 90,
   "yaw": 0,
   "image": {
    "levels": [
     {
      "url": "media/panorama_26664293_2C3C_5CCD_41B6_BA5F5C9DBD4C_0_HS_0_4_5_map.gif",
      "width": 200,
      "height": 200,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -90,
   "class": "HotspotPanoramaOverlayMap"
  }
 ]
},
{
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "items": [
  {
   "hfov": 12.02,
   "image": "this.AnimatedImageResource_4D4BD91E_554B_F9CB_41A6_AC5220473D09",
   "pitch": -28.45,
   "yaw": -28.21,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "useHandCursor": true,
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_4239118A_5546_A8CB_41CA_F25022034F96",
 "data": {
  "label": "Circle Point 02c"
 },
 "maps": [
  {
   "hfov": 12.02,
   "yaw": -28.21,
   "image": {
    "levels": [
     {
      "url": "media/panorama_26664293_2C3C_5CCD_41B6_BA5F5C9DBD4C_0_HS_1_0_0_map.gif",
      "width": 27,
      "height": 16,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -28.45,
   "class": "HotspotPanoramaOverlayMap"
  }
 ]
},
{
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_2666F540_2C3C_C44C_41C0_1FA76F1EECB2, this.camera_88375C83_AF0B_65F2_41D9_489C7F8073C4); this.mainPlayList.set('selectedIndex', 10)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "data": {
  "label": "Polygon"
 },
 "class": "HotspotPanoramaOverlay",
 "useHandCursor": true,
 "id": "overlay_7C9D7E62_6067_90AE_41C3_1B402EA1DC2A",
 "maps": [
  {
   "hfov": 52.39,
   "yaw": 156.36,
   "image": {
    "levels": [
     {
      "url": "media/panorama_26664293_2C3C_5CCD_41B6_BA5F5C9DBD4C_0_HS_4_1_0_map.gif",
      "width": 128,
      "height": 200,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": 12.59,
   "class": "HotspotPanoramaOverlayMap"
  }
 ]
},
{
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "items": [
  {
   "hfov": 9.33,
   "image": "this.AnimatedImageResource_7B76B6D9_6064_919D_41C4_D5188F7AD184",
   "pitch": -17.31,
   "yaw": 151,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "useHandCursor": true,
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_7AFDB1F9_606B_939A_41D2_D4997155D235",
 "data": {
  "label": "Circle Point 02c"
 },
 "maps": [
  {
   "hfov": 9.33,
   "yaw": 151,
   "image": {
    "levels": [
     {
      "url": "media/panorama_26664293_2C3C_5CCD_41B6_BA5F5C9DBD4C_0_HS_7_0_6_map.gif",
      "width": 27,
      "height": 16,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -17.31,
   "class": "HotspotPanoramaOverlayMap"
  }
 ]
},
{
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_266A40B1_2C3C_7CCD_41B2_B5FCEE869E17, this.camera_880D4C90_AF0B_65EE_41DB_91D6DAF4D5A6); this.mainPlayList.set('selectedIndex', 13)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "data": {
  "label": "Polygon"
 },
 "class": "HotspotPanoramaOverlay",
 "useHandCursor": true,
 "id": "overlay_7BAEA7AA_605C_9FBF_41C5_2F69003B3824",
 "maps": [
  {
   "hfov": 69.05,
   "yaw": 98.48,
   "image": {
    "levels": [
     {
      "url": "media/panorama_26664293_2C3C_5CCD_41B6_BA5F5C9DBD4C_0_HS_8_1_0_map.gif",
      "width": 174,
      "height": 200,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": 14.68,
   "class": "HotspotPanoramaOverlayMap"
  }
 ]
},
{
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "items": [
  {
   "hfov": 9.97,
   "image": "this.AnimatedImageResource_7E73DAEB_605D_91BD_41BF_E1A1381AEE7E",
   "pitch": -12.43,
   "yaw": 101.61,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "useHandCursor": true,
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_7C6FC489_605F_B07A_41A6_EC170A320204",
 "data": {
  "label": "Circle Point 02c"
 },
 "maps": [
  {
   "hfov": 9.97,
   "yaw": 101.61,
   "image": {
    "levels": [
     {
      "url": "media/panorama_26664293_2C3C_5CCD_41B6_BA5F5C9DBD4C_0_HS_9_0_0_map.gif",
      "width": 27,
      "height": 16,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -12.43,
   "class": "HotspotPanoramaOverlayMap"
  }
 ]
},
{
 "rotate": false,
 "angle": 0,
 "image": {
  "levels": [
   {
    "url": "media/panorama_2650731A_2C3C_7DFF_41BF_42020C9917DD_tcap0.png",
    "width": 500,
    "height": 500,
    "class": "ImageResourceLevel"
   }
  ],
  "class": "ImageResource"
 },
 "class": "TripodCapPanoramaOverlay",
 "hfov": 45,
 "id": "panorama_26664293_2C3C_5CCD_41B6_BA5F5C9DBD4C_tcap0",
 "distance": 50,
 "inertia": false
},
{
 "rotate": false,
 "angle": 0,
 "image": {
  "levels": [
   {
    "url": "media/panorama_2650731A_2C3C_7DFF_41BF_42020C9917DD_tcap0.png",
    "width": 500,
    "height": 500,
    "class": "ImageResourceLevel"
   }
  ],
  "class": "ImageResource"
 },
 "class": "TripodCapPanoramaOverlay",
 "hfov": 45,
 "id": "panorama_266ABC73_2C3C_444D_41A2_D12FEAAC1356_tcap0",
 "distance": 50,
 "inertia": false
},
{
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_266AA6A9_2C3C_44DD_4132_A3FBEF2422DE, this.camera_85F61F36_AF0B_6312_41C9_DF23A33A6206); this.mainPlayList.set('selectedIndex', 29)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "data": {
  "label": "Polygon"
 },
 "class": "HotspotPanoramaOverlay",
 "useHandCursor": true,
 "id": "overlay_B65CDD70_AF19_A72D_41E1_C44C1D38D707",
 "maps": [
  {
   "hfov": 90.2,
   "yaw": 140.43,
   "image": {
    "levels": [
     {
      "url": "media/panorama_266ABC73_2C3C_444D_41A2_D12FEAAC1356_0_HS_0_1_0_map.gif",
      "width": 107,
      "height": 200,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -10.23,
   "class": "HotspotPanoramaOverlayMap"
  }
 ]
},
{
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_266A36EB_2C3C_C45D_41A9_B83C69110285, this.camera_85F81F2B_AF0B_6332_41C5_8F53709957DE); this.mainPlayList.set('selectedIndex', 27)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "data": {
  "label": "Polygon"
 },
 "class": "HotspotPanoramaOverlay",
 "useHandCursor": true,
 "id": "overlay_B6966177_AF1A_FF12_41D3_C5CA208D48DB",
 "maps": [
  {
   "hfov": 90,
   "yaw": 0,
   "image": {
    "levels": [
     {
      "url": "media/panorama_266ABC73_2C3C_444D_41A2_D12FEAAC1356_0_HS_1_1_0_map.gif",
      "width": 200,
      "height": 200,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": 0,
   "class": "HotspotPanoramaOverlayMap"
  },
  {
   "hfov": 90,
   "yaw": 90,
   "image": {
    "levels": [
     {
      "url": "media/panorama_266ABC73_2C3C_444D_41A2_D12FEAAC1356_0_HS_1_2_1_map.gif",
      "width": 200,
      "height": 200,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": 0,
   "class": "HotspotPanoramaOverlayMap"
  },
  {
   "hfov": 90,
   "yaw": -90,
   "image": {
    "levels": [
     {
      "url": "media/panorama_266ABC73_2C3C_444D_41A2_D12FEAAC1356_0_HS_1_3_3_map.gif",
      "width": 200,
      "height": 200,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": 0,
   "class": "HotspotPanoramaOverlayMap"
  },
  {
   "hfov": 90,
   "yaw": 0,
   "image": {
    "levels": [
     {
      "url": "media/panorama_266ABC73_2C3C_444D_41A2_D12FEAAC1356_0_HS_1_4_5_map.gif",
      "width": 200,
      "height": 200,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -90,
   "class": "HotspotPanoramaOverlayMap"
  }
 ]
},
{
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "items": [
  {
   "hfov": 13.87,
   "image": "this.AnimatedImageResource_B4DB19E7_AF0A_AF32_41E4_58F2B1C511ED",
   "pitch": -33.01,
   "yaw": 4.1,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "useHandCursor": true,
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_B5F0EB39_AF1B_A31E_41C9_8D62850E5218",
 "data": {
  "label": "Circle Point 02c"
 },
 "maps": [
  {
   "hfov": 13.87,
   "yaw": 4.1,
   "image": {
    "levels": [
     {
      "url": "media/panorama_266ABC73_2C3C_444D_41A2_D12FEAAC1356_0_HS_2_0_6_map.gif",
      "width": 27,
      "height": 16,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -33.01,
   "class": "HotspotPanoramaOverlayMap"
  }
 ]
},
{
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "items": [
  {
   "hfov": 16.85,
   "image": "this.AnimatedImageResource_B031C32B_AF07_A332_41C4_1B1DE9DC8480",
   "pitch": -13.92,
   "yaw": -174.83,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "useHandCursor": true,
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_B516C808_AF0F_ACFD_41E2_347E09512943",
 "data": {
  "label": "Circle Point 02c"
 },
 "maps": [
  {
   "hfov": 16.85,
   "yaw": -174.83,
   "image": {
    "levels": [
     {
      "url": "media/panorama_266ABC73_2C3C_444D_41A2_D12FEAAC1356_0_HS_3_0_0_map.gif",
      "width": 27,
      "height": 16,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -13.92,
   "class": "HotspotPanoramaOverlayMap"
  }
 ]
},
{
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_266AA6A9_2C3C_44DD_4132_A3FBEF2422DE, this.camera_85C47F41_AF0B_636E_41DC_6E2945DC72B7); this.mainPlayList.set('selectedIndex', 29)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "data": {
  "label": "Polygon"
 },
 "class": "HotspotPanoramaOverlay",
 "useHandCursor": true,
 "id": "overlay_B173B151_AF06_BF6E_41DF_0C0EE37055CD",
 "maps": [
  {
   "hfov": 79.22,
   "yaw": -143.95,
   "image": {
    "levels": [
     {
      "url": "media/panorama_266ABC73_2C3C_444D_41A2_D12FEAAC1356_0_HS_4_1_0_map.gif",
      "width": 154,
      "height": 200,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": 13.31,
   "class": "HotspotPanoramaOverlayMap"
  }
 ]
},
{
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_2669B134_2C3F_DDCB_41BB_88BE90D98D45, this.camera_87AFBD42_AF0B_6772_41D9_6DA8E877F8BF); this.mainPlayList.set('selectedIndex', 20)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "data": {
  "label": "Polygon"
 },
 "class": "HotspotPanoramaOverlay",
 "useHandCursor": true,
 "id": "overlay_77C5A122_606C_B0AE_419B_1B84BF107EAD",
 "maps": [
  {
   "hfov": 119.69,
   "yaw": -116.06,
   "image": {
    "levels": [
     {
      "url": "media/panorama_2669CA02_2C3F_CFCF_41C1_E694A5B56234_0_HS_0_1_0_map.gif",
      "width": 200,
      "height": 112,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": 10.67,
   "class": "HotspotPanoramaOverlayMap"
  }
 ]
},
{
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "items": [
  {
   "hfov": 9.27,
   "image": "this.AnimatedImageResource_7B484026_607C_B0B6_41CB_C8E4959C7DDB",
   "pitch": -15.92,
   "yaw": -121.22,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "useHandCursor": true,
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_789F1C42_606D_F0F3_41D3_3C5803B683A4",
 "data": {
  "label": "Circle Point 02c"
 },
 "maps": [
  {
   "hfov": 9.27,
   "yaw": -121.22,
   "image": {
    "levels": [
     {
      "url": "media/panorama_2669CA02_2C3F_CFCF_41C1_E694A5B56234_0_HS_1_0_0_map.gif",
      "width": 27,
      "height": 16,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -15.92,
   "class": "HotspotPanoramaOverlayMap"
  }
 ]
},
{
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "areas": [
  {
   "click": "this.mainPlayList.set('selectedIndex', 22)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "data": {
  "label": "Polygon"
 },
 "class": "HotspotPanoramaOverlay",
 "useHandCursor": true,
 "id": "overlay_780D84AA_606C_F1BE_41CF_970A615CDADB",
 "maps": [
  {
   "hfov": 96.11,
   "yaw": 54.72,
   "image": {
    "levels": [
     {
      "url": "media/panorama_2669CA02_2C3F_CFCF_41C1_E694A5B56234_0_HS_2_1_0_map.gif",
      "width": 200,
      "height": 151,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": 1.62,
   "class": "HotspotPanoramaOverlayMap"
  }
 ]
},
{
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "items": [
  {
   "hfov": 11.57,
   "image": "this.AnimatedImageResource_7B49F027_607C_B0B6_41D3_986C5E82172D",
   "pitch": -26.88,
   "yaw": 59.45,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "useHandCursor": true,
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_7957508A_606F_907E_41A3_C53DE2084BDE",
 "data": {
  "label": "Circle Point 02c"
 },
 "maps": [
  {
   "hfov": 11.57,
   "yaw": 59.45,
   "image": {
    "levels": [
     {
      "url": "media/panorama_2669CA02_2C3F_CFCF_41C1_E694A5B56234_0_HS_3_0_0_map.gif",
      "width": 27,
      "height": 16,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -26.88,
   "class": "HotspotPanoramaOverlayMap"
  }
 ]
},
{
 "rotate": false,
 "angle": 0,
 "image": {
  "levels": [
   {
    "url": "media/panorama_2650731A_2C3C_7DFF_41BF_42020C9917DD_tcap0.png",
    "width": 500,
    "height": 500,
    "class": "ImageResourceLevel"
   }
  ],
  "class": "ImageResource"
 },
 "class": "TripodCapPanoramaOverlay",
 "hfov": 45,
 "id": "panorama_2669CA02_2C3F_CFCF_41C1_E694A5B56234_tcap0",
 "distance": 50,
 "inertia": false
},
{
 "rotate": false,
 "angle": 0,
 "image": {
  "levels": [
   {
    "url": "media/panorama_2650731A_2C3C_7DFF_41BF_42020C9917DD_tcap0.png",
    "width": 500,
    "height": 500,
    "class": "ImageResourceLevel"
   }
  ],
  "class": "ImageResource"
 },
 "class": "TripodCapPanoramaOverlay",
 "hfov": 45,
 "id": "panorama_264C2F16_2C3C_C5F7_41C0_5EA2911E8144_tcap0",
 "distance": 50,
 "inertia": false
},
{
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_266A48C5_2C3C_4C55_41B3_1D70C2050903, this.camera_874D6DBC_AF0B_6716_41B6_E530D314E39E); this.mainPlayList.set('selectedIndex', 3)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "data": {
  "label": "Polygon"
 },
 "class": "HotspotPanoramaOverlay",
 "useHandCursor": true,
 "id": "overlay_B2D2020B_AF09_DCF2_41CC_F3D904C35290",
 "maps": [
  {
   "hfov": 90,
   "yaw": 0,
   "image": {
    "levels": [
     {
      "url": "media/panorama_264C2F16_2C3C_C5F7_41C0_5EA2911E8144_0_HS_0_1_0_map.gif",
      "width": 200,
      "height": 200,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": 0,
   "class": "HotspotPanoramaOverlayMap"
  },
  {
   "hfov": 90,
   "yaw": -180,
   "image": {
    "levels": [
     {
      "url": "media/panorama_264C2F16_2C3C_C5F7_41C0_5EA2911E8144_0_HS_0_2_2_map.gif",
      "width": 200,
      "height": 200,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": 0,
   "class": "HotspotPanoramaOverlayMap"
  },
  {
   "hfov": 90,
   "yaw": -90,
   "image": {
    "levels": [
     {
      "url": "media/panorama_264C2F16_2C3C_C5F7_41C0_5EA2911E8144_0_HS_0_3_3_map.gif",
      "width": 200,
      "height": 200,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": 0,
   "class": "HotspotPanoramaOverlayMap"
  },
  {
   "hfov": 90,
   "yaw": 0,
   "image": {
    "levels": [
     {
      "url": "media/panorama_264C2F16_2C3C_C5F7_41C0_5EA2911E8144_0_HS_0_4_4_map.gif",
      "width": 200,
      "height": 200,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": 90,
   "class": "HotspotPanoramaOverlayMap"
  },
  {
   "hfov": 90,
   "yaw": 0,
   "image": {
    "levels": [
     {
      "url": "media/panorama_264C2F16_2C3C_C5F7_41C0_5EA2911E8144_0_HS_0_5_5_map.gif",
      "width": 200,
      "height": 200,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -90,
   "class": "HotspotPanoramaOverlayMap"
  }
 ]
},
{
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "items": [
  {
   "hfov": 14.73,
   "image": "this.AnimatedImageResource_8BED81D8_AF7E_FF1E_41CC_F2F3478C7825",
   "pitch": -27.06,
   "yaw": -81.9,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "useHandCursor": true,
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_B08DB96C_AF06_AF36_41D8_353B46FFCEC9",
 "data": {
  "label": "Circle Point 02c"
 },
 "maps": [
  {
   "hfov": 14.73,
   "yaw": -81.9,
   "image": {
    "levels": [
     {
      "url": "media/panorama_264C2F16_2C3C_C5F7_41C0_5EA2911E8144_0_HS_1_0_6_map.gif",
      "width": 27,
      "height": 16,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -27.06,
   "class": "HotspotPanoramaOverlayMap"
  }
 ]
},
{
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_26666712_2C3C_C5CF_4198_822E2A8C8DCC, this.camera_87706DAD_AF0B_6736_41DC_2F62C5A733B6); this.mainPlayList.set('selectedIndex', 32)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "data": {
  "label": "Polygon"
 },
 "class": "HotspotPanoramaOverlay",
 "useHandCursor": true,
 "id": "overlay_B10B33C9_AF07_637E_41DB_E02F9769C8AA",
 "maps": [
  {
   "hfov": 90,
   "yaw": 0,
   "image": {
    "levels": [
     {
      "url": "media/panorama_264C2F16_2C3C_C5F7_41C0_5EA2911E8144_0_HS_2_1_0_map.gif",
      "width": 200,
      "height": 200,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": 0,
   "class": "HotspotPanoramaOverlayMap"
  },
  {
   "hfov": 90,
   "yaw": 90,
   "image": {
    "levels": [
     {
      "url": "media/panorama_264C2F16_2C3C_C5F7_41C0_5EA2911E8144_0_HS_2_2_1_map.gif",
      "width": 200,
      "height": 200,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": 0,
   "class": "HotspotPanoramaOverlayMap"
  },
  {
   "hfov": 90,
   "yaw": -180,
   "image": {
    "levels": [
     {
      "url": "media/panorama_264C2F16_2C3C_C5F7_41C0_5EA2911E8144_0_HS_2_3_2_map.gif",
      "width": 200,
      "height": 200,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": 0,
   "class": "HotspotPanoramaOverlayMap"
  },
  {
   "hfov": 90,
   "yaw": 0,
   "image": {
    "levels": [
     {
      "url": "media/panorama_264C2F16_2C3C_C5F7_41C0_5EA2911E8144_0_HS_2_4_4_map.gif",
      "width": 200,
      "height": 200,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": 90,
   "class": "HotspotPanoramaOverlayMap"
  }
 ]
},
{
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "items": [
  {
   "hfov": 14.4,
   "image": "this.AnimatedImageResource_8B5639AF_AF0A_AF0D_41C6_B356B092444A",
   "pitch": -15.26,
   "yaw": 106.32,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "useHandCursor": true,
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_B119D3C8_AF07_A37E_41DB_558A3D4AE20C",
 "data": {
  "label": "Circle Point 02c"
 },
 "maps": [
  {
   "hfov": 14.4,
   "yaw": 106.32,
   "image": {
    "levels": [
     {
      "url": "media/panorama_264C2F16_2C3C_C5F7_41C0_5EA2911E8144_0_HS_3_0_0_map.gif",
      "width": 27,
      "height": 16,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -15.26,
   "class": "HotspotPanoramaOverlayMap"
  }
 ]
},
{
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_26667DFA_2C3C_443C_41B2_332913C8F61A, this.camera_870ABDFA_AF0B_6712_41DE_E10EE09D9171); this.mainPlayList.set('selectedIndex', 14)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "data": {
  "label": "Polygon"
 },
 "class": "HotspotPanoramaOverlay",
 "useHandCursor": true,
 "id": "overlay_46A4C62E_60E5_90B6_41B4_7DD93C87695C",
 "maps": [
  {
   "hfov": 90,
   "yaw": 0,
   "image": {
    "levels": [
     {
      "url": "media/panorama_266A40B1_2C3C_7CCD_41B2_B5FCEE869E17_0_HS_0_1_0_map.gif",
      "width": 200,
      "height": 200,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": 0,
   "class": "HotspotPanoramaOverlayMap"
  },
  {
   "hfov": 90,
   "yaw": 90,
   "image": {
    "levels": [
     {
      "url": "media/panorama_266A40B1_2C3C_7CCD_41B2_B5FCEE869E17_0_HS_0_2_1_map.gif",
      "width": 200,
      "height": 200,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": 0,
   "class": "HotspotPanoramaOverlayMap"
  },
  {
   "hfov": 90,
   "yaw": -90,
   "image": {
    "levels": [
     {
      "url": "media/panorama_266A40B1_2C3C_7CCD_41B2_B5FCEE869E17_0_HS_0_3_3_map.gif",
      "width": 200,
      "height": 200,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": 0,
   "class": "HotspotPanoramaOverlayMap"
  },
  {
   "hfov": 90,
   "yaw": 0,
   "image": {
    "levels": [
     {
      "url": "media/panorama_266A40B1_2C3C_7CCD_41B2_B5FCEE869E17_0_HS_0_4_4_map.gif",
      "width": 200,
      "height": 200,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": 90,
   "class": "HotspotPanoramaOverlayMap"
  }
 ]
},
{
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "items": [
  {
   "hfov": 15.66,
   "image": "this.AnimatedImageResource_46AE52F5_60EF_91AA_41D2_FCAAE7D8E209",
   "pitch": -13.96,
   "yaw": -15.46,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "useHandCursor": true,
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_43EA9003_60E4_F06E_41B9_3472781FD72B",
 "data": {
  "label": "Circle Point 02c"
 },
 "maps": [
  {
   "hfov": 15.66,
   "yaw": -15.46,
   "image": {
    "levels": [
     {
      "url": "media/panorama_266A40B1_2C3C_7CCD_41B2_B5FCEE869E17_0_HS_1_0_6_map.gif",
      "width": 27,
      "height": 16,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -13.96,
   "class": "HotspotPanoramaOverlayMap"
  }
 ]
},
{
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_26664293_2C3C_5CCD_41B6_BA5F5C9DBD4C, this.camera_8731BDEF_AF0B_6732_41DB_0AE4A495391D); this.mainPlayList.set('selectedIndex', 9)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "data": {
  "label": "Polygon"
 },
 "class": "HotspotPanoramaOverlay",
 "useHandCursor": true,
 "id": "overlay_431E5D7E_60E7_B096_41C2_9435EC9C8F59",
 "maps": [
  {
   "hfov": 118.64,
   "yaw": 128.12,
   "image": {
    "levels": [
     {
      "url": "media/panorama_266A40B1_2C3C_7CCD_41B2_B5FCEE869E17_0_HS_2_1_0_map.gif",
      "width": 170,
      "height": 200,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": 14.68,
   "class": "HotspotPanoramaOverlayMap"
  }
 ]
},
{
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "items": [
  {
   "hfov": 10.87,
   "image": "this.AnimatedImageResource_46AED2F5_60EF_91AA_41D1_05D523E7EDC8",
   "pitch": -11.35,
   "yaw": 135.36,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "useHandCursor": true,
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_47343BB1_60E4_B7AA_41D0_02140CACE288",
 "data": {
  "label": "Circle Point 02c"
 },
 "maps": [
  {
   "hfov": 10.87,
   "yaw": 135.36,
   "image": {
    "levels": [
     {
      "url": "media/panorama_266A40B1_2C3C_7CCD_41B2_B5FCEE869E17_0_HS_3_0_6_map.gif",
      "width": 27,
      "height": 16,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -11.35,
   "class": "HotspotPanoramaOverlayMap"
  }
 ]
},
{
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_266A5334_2C3C_BDCB_41C0_5ECFC0F03DE9, this.camera_8707AE04_AF0B_64F6_41E3_69714706F3FF); this.mainPlayList.set('selectedIndex', 15)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "data": {
  "label": "Polygon"
 },
 "class": "HotspotPanoramaOverlay",
 "useHandCursor": true,
 "id": "overlay_44461386_60E5_9076_41CA_A2E18D515C9F",
 "maps": [
  {
   "hfov": 100.67,
   "yaw": -118.9,
   "image": {
    "levels": [
     {
      "url": "media/panorama_266A40B1_2C3C_7CCD_41B2_B5FCEE869E17_0_HS_4_1_6_map.gif",
      "width": 185,
      "height": 200,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -1.15,
   "class": "HotspotPanoramaOverlayMap"
  }
 ]
},
{
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "items": [
  {
   "hfov": 10.67,
   "image": "this.AnimatedImageResource_46AF32F6_60EF_9196_41D4_8020DBFBA78A",
   "pitch": -35.39,
   "yaw": -121.36,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "useHandCursor": true,
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_448BA7A3_60E4_9FAE_41BC_344DA0D3FEC4",
 "data": {
  "label": "Circle Point 02c"
 },
 "maps": [
  {
   "hfov": 10.67,
   "yaw": -121.36,
   "image": {
    "levels": [
     {
      "url": "media/panorama_266A40B1_2C3C_7CCD_41B2_B5FCEE869E17_0_HS_5_0_6_map.gif",
      "width": 27,
      "height": 16,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -35.39,
   "class": "HotspotPanoramaOverlayMap"
  }
 ]
},
{
 "rotate": false,
 "angle": 0,
 "image": {
  "levels": [
   {
    "url": "media/panorama_2650731A_2C3C_7DFF_41BF_42020C9917DD_tcap0.png",
    "width": 500,
    "height": 500,
    "class": "ImageResourceLevel"
   }
  ],
  "class": "ImageResource"
 },
 "class": "TripodCapPanoramaOverlay",
 "hfov": 45,
 "id": "panorama_266A40B1_2C3C_7CCD_41B2_B5FCEE869E17_tcap0",
 "distance": 50,
 "inertia": false
},
{
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_266A2362_2C3C_7C4F_41C5_86D5259F47A8, this.camera_8793BD7D_AF0B_6716_41D9_364FC54CE70E); this.mainPlayList.set('selectedIndex', 4)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "data": {
  "label": "Polygon"
 },
 "class": "HotspotPanoramaOverlay",
 "useHandCursor": true,
 "id": "overlay_20434678_2D8D_4417_41A9_DBA90D3AD6B0",
 "maps": [
  {
   "hfov": 112.43,
   "yaw": -77.63,
   "image": {
    "levels": [
     {
      "url": "media/panorama_266A5CEF_2C3C_4455_41A5_2CBA724838F2_0_HS_0_1_0_map.gif",
      "width": 200,
      "height": 99,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -5.47,
   "class": "HotspotPanoramaOverlayMap"
  }
 ]
},
{
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "items": [
  {
   "hfov": 14.08,
   "image": "this.AnimatedImageResource_3E4ADB65_2D8E_CC39_41BA_C17969E30F6A",
   "pitch": -27.95,
   "yaw": -84.61,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "useHandCursor": true,
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_23043A42_2D8D_4C7B_4174_1B4EDA91EED8",
 "data": {
  "label": "Circle Point 02c"
 },
 "maps": [
  {
   "hfov": 14.08,
   "yaw": -84.61,
   "image": {
    "levels": [
     {
      "url": "media/panorama_266A5CEF_2C3C_4455_41A5_2CBA724838F2_0_HS_1_0_6_map.gif",
      "width": 27,
      "height": 16,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -27.95,
   "class": "HotspotPanoramaOverlayMap"
  }
 ]
},
{
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_2666CCAC_2C3C_C4D4_41B6_6F5BD1BACD46, this.camera_87995D70_AF0B_672E_41AA_2B3636E50501); this.mainPlayList.set('selectedIndex', 6)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "data": {
  "label": "Polygon"
 },
 "class": "HotspotPanoramaOverlay",
 "useHandCursor": true,
 "id": "overlay_20588FD5_2D8E_C419_41C3_B545C5AECDE5",
 "maps": [
  {
   "hfov": 90,
   "yaw": 0,
   "image": {
    "levels": [
     {
      "url": "media/panorama_266A5CEF_2C3C_4455_41A5_2CBA724838F2_0_HS_2_1_0_map.gif",
      "width": 200,
      "height": 200,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": 0,
   "class": "HotspotPanoramaOverlayMap"
  },
  {
   "hfov": 90,
   "yaw": 90,
   "image": {
    "levels": [
     {
      "url": "media/panorama_266A5CEF_2C3C_4455_41A5_2CBA724838F2_0_HS_2_2_1_map.gif",
      "width": 200,
      "height": 200,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": 0,
   "class": "HotspotPanoramaOverlayMap"
  }
 ]
},
{
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "items": [
  {
   "hfov": 13.76,
   "image": "this.AnimatedImageResource_3A32ADE6_2DBA_C43B_41C4_3C05A7D5974C",
   "pitch": -13.94,
   "yaw": 83.07,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "useHandCursor": true,
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_2316226F_2D8F_FC09_419D_8EC53E2C2C51",
 "data": {
  "label": "Circle Point 02c"
 },
 "maps": [
  {
   "hfov": 13.76,
   "yaw": 83.07,
   "image": {
    "levels": [
     {
      "url": "media/panorama_266A5CEF_2C3C_4455_41A5_2CBA724838F2_0_HS_3_0_6_map.gif",
      "width": 27,
      "height": 16,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -13.94,
   "class": "HotspotPanoramaOverlayMap"
  }
 ]
},
{
 "rotate": false,
 "angle": 0,
 "image": {
  "levels": [
   {
    "url": "media/panorama_2650731A_2C3C_7DFF_41BF_42020C9917DD_tcap0.png",
    "width": 500,
    "height": 500,
    "class": "ImageResourceLevel"
   }
  ],
  "class": "ImageResource"
 },
 "class": "TripodCapPanoramaOverlay",
 "hfov": 45,
 "id": "panorama_266A5CEF_2C3C_4455_41A5_2CBA724838F2_tcap0",
 "distance": 50,
 "inertia": false
},
{
 "rotate": false,
 "angle": 0,
 "image": {
  "levels": [
   {
    "url": "media/panorama_2650731A_2C3C_7DFF_41BF_42020C9917DD_tcap0.png",
    "width": 500,
    "height": 500,
    "class": "ImageResourceLevel"
   }
  ],
  "class": "ImageResource"
 },
 "class": "TripodCapPanoramaOverlay",
 "hfov": 45,
 "id": "panorama_26666712_2C3C_C5CF_4198_822E2A8C8DCC_tcap0",
 "distance": 50,
 "inertia": false
},
{
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_264C2F16_2C3C_C5F7_41C0_5EA2911E8144, this.camera_85983BE9_AF0B_633E_41E4_7FD328CA4A11); this.mainPlayList.set('selectedIndex', 31)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "data": {
  "label": "Polygon"
 },
 "class": "HotspotPanoramaOverlay",
 "useHandCursor": true,
 "id": "overlay_B233DDA2_AF7A_A732_41D4_E7A073FF3E26",
 "maps": [
  {
   "hfov": 90,
   "yaw": 0,
   "image": {
    "levels": [
     {
      "url": "media/panorama_26666712_2C3C_C5CF_4198_822E2A8C8DCC_0_HS_0_1_0_map.gif",
      "width": 200,
      "height": 200,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": 0,
   "class": "HotspotPanoramaOverlayMap"
  },
  {
   "hfov": 90,
   "yaw": -180,
   "image": {
    "levels": [
     {
      "url": "media/panorama_26666712_2C3C_C5CF_4198_822E2A8C8DCC_0_HS_0_2_2_map.gif",
      "width": 200,
      "height": 200,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": 0,
   "class": "HotspotPanoramaOverlayMap"
  },
  {
   "hfov": 90,
   "yaw": -90,
   "image": {
    "levels": [
     {
      "url": "media/panorama_26666712_2C3C_C5CF_4198_822E2A8C8DCC_0_HS_0_3_3_map.gif",
      "width": 200,
      "height": 200,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": 0,
   "class": "HotspotPanoramaOverlayMap"
  },
  {
   "hfov": 90,
   "yaw": 0,
   "image": {
    "levels": [
     {
      "url": "media/panorama_26666712_2C3C_C5CF_4198_822E2A8C8DCC_0_HS_0_4_4_map.gif",
      "width": 200,
      "height": 200,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": 90,
   "class": "HotspotPanoramaOverlayMap"
  },
  {
   "hfov": 90,
   "yaw": 0,
   "image": {
    "levels": [
     {
      "url": "media/panorama_26666712_2C3C_C5CF_4198_822E2A8C8DCC_0_HS_0_5_5_map.gif",
      "width": 200,
      "height": 200,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -90,
   "class": "HotspotPanoramaOverlayMap"
  }
 ]
},
{
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "items": [
  {
   "hfov": 14.76,
   "image": "this.AnimatedImageResource_8BEC11D9_AF7E_FF1E_41C5_9A642F66D73D",
   "pitch": -17.63,
   "yaw": -94.99,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "useHandCursor": true,
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_B040F2E1_AF79_5D2E_41DC_F81E4A90F044",
 "data": {
  "label": "Circle Point 02c"
 },
 "maps": [
  {
   "hfov": 14.76,
   "yaw": -94.99,
   "image": {
    "levels": [
     {
      "url": "media/panorama_26666712_2C3C_C5CF_4198_822E2A8C8DCC_0_HS_1_0_6_map.gif",
      "width": 27,
      "height": 16,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -17.63,
   "class": "HotspotPanoramaOverlayMap"
  }
 ]
},
{
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_26661FEC_2C3C_C45B_419B_861471116CC7, this.camera_858E6BDE_AF0B_6312_41D4_99D44647029B); this.mainPlayList.set('selectedIndex', 33)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "data": {
  "label": "Polygon"
 },
 "class": "HotspotPanoramaOverlay",
 "useHandCursor": true,
 "id": "overlay_B1330DF1_AF79_E72E_419E_BE1869C61C7F",
 "maps": [
  {
   "hfov": 90,
   "yaw": 0,
   "image": {
    "levels": [
     {
      "url": "media/panorama_26666712_2C3C_C5CF_4198_822E2A8C8DCC_0_HS_2_1_0_map.gif",
      "width": 200,
      "height": 200,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": 0,
   "class": "HotspotPanoramaOverlayMap"
  },
  {
   "hfov": 90,
   "yaw": 90,
   "image": {
    "levels": [
     {
      "url": "media/panorama_26666712_2C3C_C5CF_4198_822E2A8C8DCC_0_HS_2_2_1_map.gif",
      "width": 200,
      "height": 200,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": 0,
   "class": "HotspotPanoramaOverlayMap"
  },
  {
   "hfov": 90,
   "yaw": -180,
   "image": {
    "levels": [
     {
      "url": "media/panorama_26666712_2C3C_C5CF_4198_822E2A8C8DCC_0_HS_2_3_2_map.gif",
      "width": 200,
      "height": 200,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": 0,
   "class": "HotspotPanoramaOverlayMap"
  },
  {
   "hfov": 90,
   "yaw": 0,
   "image": {
    "levels": [
     {
      "url": "media/panorama_26666712_2C3C_C5CF_4198_822E2A8C8DCC_0_HS_2_4_4_map.gif",
      "width": 200,
      "height": 200,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": 90,
   "class": "HotspotPanoramaOverlayMap"
  }
 ]
},
{
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "items": [
  {
   "hfov": 14.36,
   "image": "this.AnimatedImageResource_8BF3A1DF_AF7E_FF12_41D5_AC78FF4FB651",
   "pitch": -16.17,
   "yaw": 89.5,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "useHandCursor": true,
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_8FD557DD_AF7E_A316_41DB_2827AEA0B947",
 "data": {
  "label": "Circle Point 02c"
 },
 "maps": [
  {
   "hfov": 14.36,
   "yaw": 89.5,
   "image": {
    "levels": [
     {
      "url": "media/panorama_26666712_2C3C_C5CF_4198_822E2A8C8DCC_0_HS_3_0_6_map.gif",
      "width": 27,
      "height": 16,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -16.17,
   "class": "HotspotPanoramaOverlayMap"
  }
 ]
},
{
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_2666F3DA_2C3C_BC7F_41A5_8719A461067F, this.camera_85A09BBC_AF0B_6316_41D6_C153F6BFAB44); this.mainPlayList.set('selectedIndex', 7)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "data": {
  "label": "Polygon"
 },
 "class": "HotspotPanoramaOverlay",
 "useHandCursor": true,
 "id": "overlay_3B0A1B1C_2D9B_4C0F_41B6_BA4B76E85157",
 "maps": [
  {
   "hfov": 90,
   "yaw": 0,
   "image": {
    "levels": [
     {
      "url": "media/panorama_2666CCAC_2C3C_C4D4_41B6_6F5BD1BACD46_0_HS_0_1_0_map.gif",
      "width": 200,
      "height": 200,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": 0,
   "class": "HotspotPanoramaOverlayMap"
  },
  {
   "hfov": 90,
   "yaw": -90,
   "image": {
    "levels": [
     {
      "url": "media/panorama_2666CCAC_2C3C_C4D4_41B6_6F5BD1BACD46_0_HS_0_2_3_map.gif",
      "width": 200,
      "height": 200,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": 0,
   "class": "HotspotPanoramaOverlayMap"
  },
  {
   "hfov": 90,
   "yaw": 0,
   "image": {
    "levels": [
     {
      "url": "media/panorama_2666CCAC_2C3C_C4D4_41B6_6F5BD1BACD46_0_HS_0_3_4_map.gif",
      "width": 200,
      "height": 200,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": 90,
   "class": "HotspotPanoramaOverlayMap"
  }
 ]
},
{
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_266A5CEF_2C3C_4455_41A5_2CBA724838F2, this.camera_85BA5BC9_AF0B_637E_41D4_CDFFEF9EEC4A); this.mainPlayList.set('selectedIndex', 5)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "data": {
  "label": "Polygon"
 },
 "class": "HotspotPanoramaOverlay",
 "useHandCursor": true,
 "id": "overlay_3A6B540B_2D9A_C409_41C5_5D5C8307B813",
 "maps": [
  {
   "hfov": 53.67,
   "yaw": 152.11,
   "image": {
    "levels": [
     {
      "url": "media/panorama_2666CCAC_2C3C_C4D4_41B6_6F5BD1BACD46_0_HS_2_1_6_map.gif",
      "width": 154,
      "height": 200,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": 0.88,
   "class": "HotspotPanoramaOverlayMap"
  }
 ]
},
{
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_266A5CEF_2C3C_4455_41A5_2CBA724838F2, this.camera_85B4BBD4_AF0B_6316_41C3_59AB861AFD38); this.mainPlayList.set('selectedIndex', 5)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "data": {
  "label": "Polygon"
 },
 "class": "HotspotPanoramaOverlay",
 "useHandCursor": true,
 "id": "overlay_3A53ABE4_2D85_4C3F_41BA_BE5382E75734",
 "maps": [
  {
   "hfov": 54.76,
   "yaw": -153.12,
   "image": {
    "levels": [
     {
      "url": "media/panorama_2666CCAC_2C3C_C4D4_41B6_6F5BD1BACD46_0_HS_4_1_6_map.gif",
      "width": 135,
      "height": 200,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -9.09,
   "class": "HotspotPanoramaOverlayMap"
  }
 ]
},
{
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "items": [
  {
   "hfov": 11.85,
   "image": "this.AnimatedImageResource_3BD7DA84_2D85_4CFF_41C0_A83123AD5973",
   "pitch": -14.87,
   "yaw": -33.89,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "useHandCursor": true,
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_380F7561_2D85_4439_41BF_A81BAF51F55A",
 "data": {
  "label": "Arrow 06"
 },
 "maps": [
  {
   "hfov": 11.85,
   "yaw": -33.89,
   "image": {
    "levels": [
     {
      "url": "media/panorama_2666CCAC_2C3C_C4D4_41B6_6F5BD1BACD46_0_HS_7_0_0_map.gif",
      "width": 30,
      "height": 16,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -14.87,
   "class": "HotspotPanoramaOverlayMap"
  }
 ]
},
{
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "items": [
  {
   "hfov": 12.28,
   "image": "this.AnimatedImageResource_3AF8B4FE_2D87_440B_41B9_98B805F79E33",
   "pitch": -19.65,
   "yaw": 152.64,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "useHandCursor": true,
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_3ADB1F31_2DBB_4419_41B4_423AAF3487DE",
 "data": {
  "label": "Circle Point 02c"
 },
 "maps": [
  {
   "hfov": 12.28,
   "yaw": 152.64,
   "image": {
    "levels": [
     {
      "url": "media/panorama_2666CCAC_2C3C_C4D4_41B6_6F5BD1BACD46_0_HS_9_0_0_map.gif",
      "width": 27,
      "height": 16,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -19.65,
   "class": "HotspotPanoramaOverlayMap"
  }
 ]
},
{
 "rotate": false,
 "angle": 0,
 "image": {
  "levels": [
   {
    "url": "media/panorama_2650731A_2C3C_7DFF_41BF_42020C9917DD_tcap0.png",
    "width": 500,
    "height": 500,
    "class": "ImageResourceLevel"
   }
  ],
  "class": "ImageResource"
 },
 "class": "TripodCapPanoramaOverlay",
 "hfov": 45,
 "id": "panorama_2666CCAC_2C3C_C4D4_41B6_6F5BD1BACD46_tcap0",
 "distance": 50,
 "inertia": false
},
{
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_26664293_2C3C_5CCD_41B6_BA5F5C9DBD4C, this.camera_87E8DCD8_AF0B_651E_419C_4EC163483506); this.mainPlayList.set('selectedIndex', 9)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "data": {
  "label": "Polygon"
 },
 "class": "HotspotPanoramaOverlay",
 "useHandCursor": true,
 "id": "overlay_41F0651D_5579_A9CE_41C6_3BE692E0E12F",
 "maps": [
  {
   "hfov": 90,
   "yaw": 0,
   "image": {
    "levels": [
     {
      "url": "media/panorama_26663B80_2C3C_4CCC_41C4_05539F545C2A_0_HS_0_1_0_map.gif",
      "width": 200,
      "height": 200,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": 0,
   "class": "HotspotPanoramaOverlayMap"
  },
  {
   "hfov": 90,
   "yaw": -90,
   "image": {
    "levels": [
     {
      "url": "media/panorama_26663B80_2C3C_4CCC_41C4_05539F545C2A_0_HS_0_2_3_map.gif",
      "width": 200,
      "height": 200,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": 0,
   "class": "HotspotPanoramaOverlayMap"
  },
  {
   "hfov": 90,
   "yaw": 0,
   "image": {
    "levels": [
     {
      "url": "media/panorama_26663B80_2C3C_4CCC_41C4_05539F545C2A_0_HS_0_3_4_map.gif",
      "width": 200,
      "height": 200,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": 90,
   "class": "HotspotPanoramaOverlayMap"
  }
 ]
},
{
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "items": [
  {
   "hfov": 13.55,
   "image": "this.AnimatedImageResource_426B20EF_557A_A84A_41BD_86F4ADC9B8D4",
   "pitch": -19.47,
   "yaw": -19.75,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "useHandCursor": true,
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_40916CFE_557E_F84B_419C_21FDD14CE415",
 "data": {
  "label": "Circle Point 02c"
 },
 "maps": [
  {
   "hfov": 13.55,
   "yaw": -19.75,
   "image": {
    "levels": [
     {
      "url": "media/panorama_26663B80_2C3C_4CCC_41C4_05539F545C2A_0_HS_1_0_6_map.gif",
      "width": 27,
      "height": 16,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -19.47,
   "class": "HotspotPanoramaOverlayMap"
  }
 ]
},
{
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_2666F3DA_2C3C_BC7F_41A5_8719A461067F, this.camera_881DFCBD_AF0B_6516_41AB_591C6493915B); this.mainPlayList.set('selectedIndex', 7)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "data": {
  "label": "Polygon"
 },
 "class": "HotspotPanoramaOverlay",
 "useHandCursor": true,
 "id": "overlay_40432C84_557E_58BF_41C0_FA122CEE6020",
 "maps": [
  {
   "hfov": 74.13,
   "yaw": 143.57,
   "image": {
    "levels": [
     {
      "url": "media/panorama_26663B80_2C3C_4CCC_41C4_05539F545C2A_0_HS_2_1_6_map.gif",
      "width": 200,
      "height": 141,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -1.47,
   "class": "HotspotPanoramaOverlayMap"
  }
 ]
},
{
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "items": [
  {
   "hfov": 8.06,
   "image": "this.AnimatedImageResource_4274A0EF_557A_A84A_41C8_5ED46874DD11",
   "pitch": -28.5,
   "yaw": 157.45,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "useHandCursor": true,
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_40102A2C_557E_FBCF_41CC_1B1081E8E959",
 "data": {
  "label": "Circle Point 02c"
 },
 "maps": [
  {
   "hfov": 8.06,
   "yaw": 157.45,
   "image": {
    "levels": [
     {
      "url": "media/panorama_26663B80_2C3C_4CCC_41C4_05539F545C2A_0_HS_3_0_6_map.gif",
      "width": 27,
      "height": 16,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -28.5,
   "class": "HotspotPanoramaOverlayMap"
  }
 ]
},
{
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_2666F3DA_2C3C_BC7F_41A5_8719A461067F, this.camera_88132CCC_AF0B_6575_41DF_F0D8551D31A8); this.mainPlayList.set('selectedIndex', 7)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "data": {
  "label": "Polygon"
 },
 "class": "HotspotPanoramaOverlay",
 "useHandCursor": true,
 "id": "overlay_4193CB30_5579_B9D6_4193_292EAD704596",
 "maps": [
  {
   "hfov": 54.53,
   "yaw": -153.5,
   "image": {
    "levels": [
     {
      "url": "media/panorama_26663B80_2C3C_4CCC_41C4_05539F545C2A_0_HS_4_1_6_map.gif",
      "width": 164,
      "height": 200,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -4.12,
   "class": "HotspotPanoramaOverlayMap"
  }
 ]
},
{
 "rotate": false,
 "angle": 0,
 "image": {
  "levels": [
   {
    "url": "media/panorama_2650731A_2C3C_7DFF_41BF_42020C9917DD_tcap0.png",
    "width": 500,
    "height": 500,
    "class": "ImageResourceLevel"
   }
  ],
  "class": "ImageResource"
 },
 "class": "TripodCapPanoramaOverlay",
 "hfov": 45,
 "id": "panorama_26663B80_2C3C_4CCC_41C4_05539F545C2A_tcap0",
 "distance": 50,
 "inertia": false
},
{
 "rotate": false,
 "angle": 0,
 "image": {
  "levels": [
   {
    "url": "media/panorama_2650731A_2C3C_7DFF_41BF_42020C9917DD_tcap0.png",
    "width": 500,
    "height": 500,
    "class": "ImageResourceLevel"
   }
  ],
  "class": "ImageResource"
 },
 "class": "TripodCapPanoramaOverlay",
 "hfov": 45,
 "id": "panorama_266A36EB_2C3C_C45D_41A9_B83C69110285_tcap0",
 "distance": 50,
 "inertia": false
},
{
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_266ABC73_2C3C_444D_41A2_D12FEAAC1356, this.camera_87676D9B_AF0B_6712_41A7_DCEBED6419EB); this.mainPlayList.set('selectedIndex', 28)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "data": {
  "label": "Polygon"
 },
 "class": "HotspotPanoramaOverlay",
 "useHandCursor": true,
 "id": "overlay_B4554F1F_AF06_E312_41D7_00F88FED45E6",
 "maps": [
  {
   "hfov": 90,
   "yaw": 0,
   "image": {
    "levels": [
     {
      "url": "media/panorama_266A36EB_2C3C_C45D_41A9_B83C69110285_0_HS_0_1_0_map.gif",
      "width": 200,
      "height": 200,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": 0,
   "class": "HotspotPanoramaOverlayMap"
  },
  {
   "hfov": 90,
   "yaw": 90,
   "image": {
    "levels": [
     {
      "url": "media/panorama_266A36EB_2C3C_C45D_41A9_B83C69110285_0_HS_0_2_1_map.gif",
      "width": 200,
      "height": 200,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": 0,
   "class": "HotspotPanoramaOverlayMap"
  },
  {
   "hfov": 90,
   "yaw": -180,
   "image": {
    "levels": [
     {
      "url": "media/panorama_266A36EB_2C3C_C45D_41A9_B83C69110285_0_HS_0_3_2_map.gif",
      "width": 200,
      "height": 200,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": 0,
   "class": "HotspotPanoramaOverlayMap"
  },
  {
   "hfov": 90,
   "yaw": 0,
   "image": {
    "levels": [
     {
      "url": "media/panorama_266A36EB_2C3C_C45D_41A9_B83C69110285_0_HS_0_4_4_map.gif",
      "width": 200,
      "height": 200,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": 90,
   "class": "HotspotPanoramaOverlayMap"
  },
  {
   "hfov": 90,
   "yaw": 0,
   "image": {
    "levels": [
     {
      "url": "media/panorama_266A36EB_2C3C_C45D_41A9_B83C69110285_0_HS_0_5_5_map.gif",
      "width": 200,
      "height": 200,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -90,
   "class": "HotspotPanoramaOverlayMap"
  }
 ]
},
{
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "items": [
  {
   "hfov": 12.83,
   "image": "this.AnimatedImageResource_B378C89E_AF09_AD12_41E1_093F1C824BC9",
   "pitch": -9.31,
   "yaw": 112.75,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "useHandCursor": true,
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_B34CEF41_AF07_636E_41E2_6AD7F70D317F",
 "data": {
  "label": "Circle Point 02c"
 },
 "maps": [
  {
   "hfov": 12.83,
   "yaw": 112.75,
   "image": {
    "levels": [
     {
      "url": "media/panorama_266A36EB_2C3C_C45D_41A9_B83C69110285_0_HS_1_0_6_map.gif",
      "width": 27,
      "height": 16,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -9.31,
   "class": "HotspotPanoramaOverlayMap"
  }
 ]
},
{
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_266ACD16_2C3C_C5F4_41C4_48EB0653785E, this.camera_876CBD8C_AF0B_67F6_41DE_735E4F58AD6A); this.mainPlayList.set('selectedIndex', 26)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "data": {
  "label": "Polygon"
 },
 "class": "HotspotPanoramaOverlay",
 "useHandCursor": true,
 "id": "overlay_B0892951_AF07_6F6E_41C1_721BC4BF481C",
 "maps": [
  {
   "hfov": 90,
   "yaw": 0,
   "image": {
    "levels": [
     {
      "url": "media/panorama_266A36EB_2C3C_C45D_41A9_B83C69110285_0_HS_2_1_0_map.gif",
      "width": 200,
      "height": 200,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": 0,
   "class": "HotspotPanoramaOverlayMap"
  },
  {
   "hfov": 90,
   "yaw": -180,
   "image": {
    "levels": [
     {
      "url": "media/panorama_266A36EB_2C3C_C45D_41A9_B83C69110285_0_HS_2_2_2_map.gif",
      "width": 200,
      "height": 200,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": 0,
   "class": "HotspotPanoramaOverlayMap"
  },
  {
   "hfov": 90,
   "yaw": -90,
   "image": {
    "levels": [
     {
      "url": "media/panorama_266A36EB_2C3C_C45D_41A9_B83C69110285_0_HS_2_3_3_map.gif",
      "width": 200,
      "height": 200,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": 0,
   "class": "HotspotPanoramaOverlayMap"
  },
  {
   "hfov": 90,
   "yaw": 0,
   "image": {
    "levels": [
     {
      "url": "media/panorama_266A36EB_2C3C_C45D_41A9_B83C69110285_0_HS_2_4_4_map.gif",
      "width": 200,
      "height": 200,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": 90,
   "class": "HotspotPanoramaOverlayMap"
  },
  {
   "hfov": 90,
   "yaw": 0,
   "image": {
    "levels": [
     {
      "url": "media/panorama_266A36EB_2C3C_C45D_41A9_B83C69110285_0_HS_2_5_5_map.gif",
      "width": 200,
      "height": 200,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -90,
   "class": "HotspotPanoramaOverlayMap"
  }
 ]
},
{
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "items": [
  {
   "hfov": 15.41,
   "image": "this.AnimatedImageResource_B30C5C18_AF3A_A51E_41BB_B8A417EF1A5B",
   "pitch": -38.48,
   "yaw": -69.25,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "useHandCursor": true,
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_B3AE81A4_AF06_BF36_41E2_A6D19C63A480",
 "data": {
  "label": "Circle Point 02c"
 },
 "maps": [
  {
   "hfov": 15.41,
   "yaw": -69.25,
   "image": {
    "levels": [
     {
      "url": "media/panorama_266A36EB_2C3C_C45D_41A9_B83C69110285_0_HS_3_0_6_map.gif",
      "width": 27,
      "height": 16,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -38.48,
   "class": "HotspotPanoramaOverlayMap"
  }
 ]
},
{
 "rotate": false,
 "angle": 0,
 "image": {
  "levels": [
   {
    "url": "media/panorama_2650731A_2C3C_7DFF_41BF_42020C9917DD_tcap0.png",
    "width": 500,
    "height": 500,
    "class": "ImageResourceLevel"
   }
  ],
  "class": "ImageResource"
 },
 "class": "TripodCapPanoramaOverlay",
 "hfov": 45,
 "id": "panorama_266AF94D_2C3C_CC54_4196_59CC1A2DCC79_tcap0",
 "distance": 50,
 "inertia": false
},
{
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_266ACD16_2C3C_C5F4_41C4_48EB0653785E, this.camera_869F8E9C_AF0B_6516_41A5_9E297CABCE99); this.mainPlayList.set('selectedIndex', 26)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "data": {
  "label": "Polygon"
 },
 "class": "HotspotPanoramaOverlay",
 "useHandCursor": true,
 "id": "overlay_B2EBE8B7_AF3A_AD12_41DD_7547A38EDAE2",
 "maps": [
  {
   "hfov": 96.84,
   "yaw": 139.68,
   "image": {
    "levels": [
     {
      "url": "media/panorama_266AF94D_2C3C_CC54_4196_59CC1A2DCC79_0_HS_0_1_0_map.gif",
      "width": 155,
      "height": 200,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -16.38,
   "class": "HotspotPanoramaOverlayMap"
  }
 ]
},
{
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "items": [
  {
   "hfov": 16.51,
   "image": "this.AnimatedImageResource_B37AF899_AF09_AD1E_41E0_47F63B2E5918",
   "pitch": -19.9,
   "yaw": -173.44,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "useHandCursor": true,
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_B1F25BEB_AF3A_E332_41DC_0B2C98BE4D9E",
 "data": {
  "label": "Circle Point 02c"
 },
 "maps": [
  {
   "hfov": 16.51,
   "yaw": -173.44,
   "image": {
    "levels": [
     {
      "url": "media/panorama_266AF94D_2C3C_CC54_4196_59CC1A2DCC79_0_HS_1_0_0_map.gif",
      "width": 27,
      "height": 16,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -19.9,
   "class": "HotspotPanoramaOverlayMap"
  }
 ]
},
{
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_266ACD16_2C3C_C5F4_41C4_48EB0653785E, this.camera_8668EEB0_AF0B_652E_41D8_621A892DE8FF); this.mainPlayList.set('selectedIndex', 26)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "data": {
  "label": "Polygon"
 },
 "class": "HotspotPanoramaOverlay",
 "useHandCursor": true,
 "id": "overlay_B2209828_AF1E_ED3E_41E5_72D7D87A80BE",
 "maps": [
  {
   "hfov": 72.4,
   "yaw": -146.46,
   "image": {
    "levels": [
     {
      "url": "media/panorama_266AF94D_2C3C_CC54_4196_59CC1A2DCC79_0_HS_2_1_0_map.gif",
      "width": 128,
      "height": 200,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": 4.8,
   "class": "HotspotPanoramaOverlayMap"
  }
 ]
},
{
 "rotate": false,
 "angle": 0,
 "image": {
  "levels": [
   {
    "url": "media/panorama_2650731A_2C3C_7DFF_41BF_42020C9917DD_tcap0.png",
    "width": 500,
    "height": 500,
    "class": "ImageResourceLevel"
   }
  ],
  "class": "ImageResource"
 },
 "class": "TripodCapPanoramaOverlay",
 "hfov": 45,
 "id": "panorama_2669CEC5_2C3F_C455_41C1_4FFEA2873441_tcap0",
 "distance": 50,
 "inertia": false
},
{
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_266659AF_2C3C_4CD5_41A2_2211D54F0994, this.camera_87471DC7_AF0B_6772_41E5_98C0EE5073C3); this.mainPlayList.set('selectedIndex', 24)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "data": {
  "label": "Polygon"
 },
 "class": "HotspotPanoramaOverlay",
 "useHandCursor": true,
 "id": "overlay_8C077ED2_AF0A_A512_41D8_253DB37FD2F7",
 "maps": [
  {
   "hfov": 115.71,
   "yaw": 131.53,
   "image": {
    "levels": [
     {
      "url": "media/panorama_2669CEC5_2C3F_C455_41C1_4FFEA2873441_0_HS_0_1_0_map.gif",
      "width": 179,
      "height": 200,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -15.76,
   "class": "HotspotPanoramaOverlayMap"
  }
 ]
},
{
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_266659AF_2C3C_4CD5_41A2_2211D54F0994, this.camera_87504DD1_AF0B_676E_41DA_4A11711717A7); this.mainPlayList.set('selectedIndex', 24)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "data": {
  "label": "Polygon"
 },
 "class": "HotspotPanoramaOverlay",
 "useHandCursor": true,
 "id": "overlay_89EEF742_AF0E_A372_41D0_C23866529BBC",
 "maps": [
  {
   "hfov": 36.38,
   "yaw": -162.04,
   "image": {
    "levels": [
     {
      "url": "media/panorama_2669CEC5_2C3F_C455_41C1_4FFEA2873441_0_HS_1_1_0_map.gif",
      "width": 111,
      "height": 200,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -0.82,
   "class": "HotspotPanoramaOverlayMap"
  }
 ]
},
{
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "items": [
  {
   "hfov": 11.81,
   "image": "this.AnimatedImageResource_875D2222_AF1B_5D32_41D6_F5EB350D9AFE",
   "pitch": -2.56,
   "yaw": -170.31,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "useHandCursor": true,
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_8BDEE56C_AF06_A735_41E0_9372F3597583",
 "data": {
  "label": "Circle Point 02c"
 },
 "maps": [
  {
   "hfov": 11.81,
   "yaw": -170.31,
   "image": {
    "levels": [
     {
      "url": "media/panorama_2669CEC5_2C3F_C455_41C1_4FFEA2873441_0_HS_3_0_0_map.gif",
      "width": 27,
      "height": 16,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -2.56,
   "class": "HotspotPanoramaOverlayMap"
  }
 ]
},
{
 "rotate": false,
 "angle": 0,
 "image": {
  "levels": [
   {
    "url": "media/panorama_2650731A_2C3C_7DFF_41BF_42020C9917DD_tcap0.png",
    "width": 500,
    "height": 500,
    "class": "ImageResourceLevel"
   }
  ],
  "class": "ImageResource"
 },
 "class": "TripodCapPanoramaOverlay",
 "hfov": 45,
 "id": "panorama_266ACD16_2C3C_C5F4_41C4_48EB0653785E_tcap0",
 "distance": 50,
 "inertia": false
},
{
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_266A36EB_2C3C_C45D_41A9_B83C69110285, this.camera_8635CEFF_AF0B_6512_41E0_FF26BCD983BC); this.mainPlayList.set('selectedIndex', 27)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "data": {
  "label": "Polygon"
 },
 "class": "HotspotPanoramaOverlay",
 "useHandCursor": true,
 "id": "overlay_B32E8CC6_AF3F_A572_41DE_C26B94C38319",
 "maps": [
  {
   "hfov": 90,
   "yaw": 0,
   "image": {
    "levels": [
     {
      "url": "media/panorama_266ACD16_2C3C_C5F4_41C4_48EB0653785E_0_HS_0_1_0_map.gif",
      "width": 200,
      "height": 200,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": 0,
   "class": "HotspotPanoramaOverlayMap"
  },
  {
   "hfov": 90,
   "yaw": 90,
   "image": {
    "levels": [
     {
      "url": "media/panorama_266ACD16_2C3C_C5F4_41C4_48EB0653785E_0_HS_0_2_1_map.gif",
      "width": 200,
      "height": 200,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": 0,
   "class": "HotspotPanoramaOverlayMap"
  },
  {
   "hfov": 90,
   "yaw": -180,
   "image": {
    "levels": [
     {
      "url": "media/panorama_266ACD16_2C3C_C5F4_41C4_48EB0653785E_0_HS_0_3_2_map.gif",
      "width": 200,
      "height": 200,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": 0,
   "class": "HotspotPanoramaOverlayMap"
  },
  {
   "hfov": 90,
   "yaw": 0,
   "image": {
    "levels": [
     {
      "url": "media/panorama_266ACD16_2C3C_C5F4_41C4_48EB0653785E_0_HS_0_4_4_map.gif",
      "width": 200,
      "height": 200,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": 90,
   "class": "HotspotPanoramaOverlayMap"
  },
  {
   "hfov": 90,
   "yaw": 0,
   "image": {
    "levels": [
     {
      "url": "media/panorama_266ACD16_2C3C_C5F4_41C4_48EB0653785E_0_HS_0_5_5_map.gif",
      "width": 200,
      "height": 200,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -90,
   "class": "HotspotPanoramaOverlayMap"
  }
 ]
},
{
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "items": [
  {
   "hfov": 20.43,
   "image": "this.AnimatedImageResource_B37BB89A_AF09_AD12_41BA_DCDF2992136E",
   "pitch": -21.54,
   "yaw": 86.98,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "useHandCursor": true,
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_B01EB080_AF3F_5DEE_41DD_BB31B9085012",
 "data": {
  "label": "Circle Point 02c"
 },
 "maps": [
  {
   "hfov": 20.43,
   "yaw": 86.98,
   "image": {
    "levels": [
     {
      "url": "media/panorama_266ACD16_2C3C_C5F4_41C4_48EB0653785E_0_HS_1_0_0_map.gif",
      "width": 27,
      "height": 16,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -21.54,
   "class": "HotspotPanoramaOverlayMap"
  }
 ]
},
{
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_266AF94D_2C3C_CC54_4196_59CC1A2DCC79, this.camera_8603CF0A_AF0B_64F2_41D5_9303AC26882D); this.mainPlayList.set('selectedIndex', 25)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "data": {
  "label": "Polygon"
 },
 "class": "HotspotPanoramaOverlay",
 "useHandCursor": true,
 "id": "overlay_B24CEC14_AF39_6516_41E4_1A670E86B673",
 "maps": [
  {
   "hfov": 90,
   "yaw": 0,
   "image": {
    "levels": [
     {
      "url": "media/panorama_266ACD16_2C3C_C5F4_41C4_48EB0653785E_0_HS_2_1_0_map.gif",
      "width": 200,
      "height": 200,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": 0,
   "class": "HotspotPanoramaOverlayMap"
  },
  {
   "hfov": 90,
   "yaw": -180,
   "image": {
    "levels": [
     {
      "url": "media/panorama_266ACD16_2C3C_C5F4_41C4_48EB0653785E_0_HS_2_2_2_map.gif",
      "width": 200,
      "height": 200,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": 0,
   "class": "HotspotPanoramaOverlayMap"
  },
  {
   "hfov": 90,
   "yaw": -90,
   "image": {
    "levels": [
     {
      "url": "media/panorama_266ACD16_2C3C_C5F4_41C4_48EB0653785E_0_HS_2_3_3_map.gif",
      "width": 200,
      "height": 200,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": 0,
   "class": "HotspotPanoramaOverlayMap"
  },
  {
   "hfov": 90,
   "yaw": 0,
   "image": {
    "levels": [
     {
      "url": "media/panorama_266ACD16_2C3C_C5F4_41C4_48EB0653785E_0_HS_2_4_4_map.gif",
      "width": 200,
      "height": 200,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": 90,
   "class": "HotspotPanoramaOverlayMap"
  },
  {
   "hfov": 90,
   "yaw": 0,
   "image": {
    "levels": [
     {
      "url": "media/panorama_266ACD16_2C3C_C5F4_41C4_48EB0653785E_0_HS_2_5_5_map.gif",
      "width": 200,
      "height": 200,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -90,
   "class": "HotspotPanoramaOverlayMap"
  }
 ]
},
{
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "items": [
  {
   "hfov": 12.4,
   "image": "this.AnimatedImageResource_B0332323_AF07_A332_41CC_F4703A952313",
   "pitch": -28.33,
   "yaw": -89.63,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "useHandCursor": true,
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_B2593388_AF39_A3FE_41E4_AED1194C6BDD",
 "data": {
  "label": "Circle Point 02c"
 },
 "maps": [
  {
   "hfov": 12.4,
   "yaw": -89.63,
   "image": {
    "levels": [
     {
      "url": "media/panorama_266ACD16_2C3C_C5F4_41C4_48EB0653785E_0_HS_3_0_6_map.gif",
      "width": 27,
      "height": 16,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -28.33,
   "class": "HotspotPanoramaOverlayMap"
  }
 ]
},
{
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "areas": [
  {
   "click": "this.startPanoramaWithCamera(this.panorama_274E4A2E_2C3D_CFD7_41C3_E749466BFD9F, this.camera_861F7F14_AF0B_6316_41B6_70A429A6DE24); this.mainPlayList.set('selectedIndex', 1)",
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "data": {
  "label": "Polygon"
 },
 "class": "HotspotPanoramaOverlay",
 "useHandCursor": true,
 "id": "overlay_22835314_2C44_DDCB_41B6_140806259706",
 "maps": [
  {
   "hfov": 129.13,
   "yaw": -111.42,
   "image": {
    "levels": [
     {
      "url": "media/panorama_2650731A_2C3C_7DFF_41BF_42020C9917DD_1_HS_0_1_0_map.gif",
      "width": 200,
      "height": 66,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": 24.52,
   "class": "HotspotPanoramaOverlayMap"
  }
 ]
},
{
 "enabledInCardboard": true,
 "rollOverDisplay": false,
 "items": [
  {
   "hfov": 10.62,
   "image": "this.AnimatedImageResource_82D2827A_AF0A_DD12_41E2_2F75E24A1068",
   "pitch": -7.83,
   "yaw": -130.19,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "class": "HotspotPanoramaOverlay",
 "useHandCursor": true,
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_22E12492_2C45_C4CC_41BF_444D79D5A280",
 "data": {
  "label": "Circle Point 02c"
 },
 "maps": [
  {
   "hfov": 10.62,
   "yaw": -130.19,
   "image": {
    "levels": [
     {
      "url": "media/panorama_2650731A_2C3C_7DFF_41BF_42020C9917DD_0_HS_1_0_0_map.gif",
      "width": 27,
      "height": 16,
      "class": "ImageResourceLevel"
     }
    ],
    "class": "ImageResource"
   },
   "pitch": -7.83,
   "class": "HotspotPanoramaOverlayMap"
  }
 ]
},
{
 "rotate": false,
 "angle": 0,
 "image": {
  "levels": [
   {
    "url": "media/panorama_2650731A_2C3C_7DFF_41BF_42020C9917DD_tcap0.png",
    "width": 500,
    "height": 500,
    "class": "ImageResourceLevel"
   }
  ],
  "class": "ImageResource"
 },
 "class": "TripodCapPanoramaOverlay",
 "hfov": 45,
 "id": "panorama_2650731A_2C3C_7DFF_41BF_42020C9917DD_tcap0",
 "distance": 50,
 "inertia": false
},
{
 "rowCount": 6,
 "frameCount": 21,
 "levels": [
  {
   "url": "media/panorama_266A48C5_2C3C_4C55_41B3_1D70C2050903_1_HS_3_0.png",
   "width": 480,
   "height": 420,
   "class": "ImageResourceLevel"
  }
 ],
 "class": "AnimatedImageResource",
 "colCount": 4,
 "id": "AnimatedImageResource_3FF2BD5B_2CCC_447D_41A6_1344EE648DAF",
 "frameDuration": 41
},
{
 "rowCount": 6,
 "frameCount": 24,
 "levels": [
  {
   "url": "media/panorama_266A48C5_2C3C_4C55_41B3_1D70C2050903_0_HS_5_0.png",
   "width": 520,
   "height": 420,
   "class": "ImageResourceLevel"
  }
 ],
 "class": "AnimatedImageResource",
 "colCount": 4,
 "id": "AnimatedImageResource_4D645E88_557A_B8B7_41CE_804F462F1C48",
 "frameDuration": 41
},
{
 "rowCount": 6,
 "frameCount": 21,
 "levels": [
  {
   "url": "media/panorama_266A48C5_2C3C_4C55_41B3_1D70C2050903_0_HS_7_0.png",
   "width": 480,
   "height": 420,
   "class": "ImageResourceLevel"
  }
 ],
 "class": "AnimatedImageResource",
 "colCount": 4,
 "id": "AnimatedImageResource_8BCD0198_AF7E_FF1E_41D2_A4B8BC09EC70",
 "frameDuration": 41
},
{
 "rowCount": 6,
 "frameCount": 21,
 "levels": [
  {
   "url": "media/panorama_266ACC21_2C3C_CBCD_41B6_407672D395B3_0_HS_1_0.png",
   "width": 480,
   "height": 420,
   "class": "ImageResourceLevel"
  }
 ],
 "class": "AnimatedImageResource",
 "colCount": 4,
 "id": "AnimatedImageResource_82C4C28B_AF0A_DDF2_41E0_3733ECB5366C",
 "frameDuration": 41
},
{
 "rowCount": 6,
 "frameCount": 21,
 "levels": [
  {
   "url": "media/panorama_266ACC21_2C3C_CBCD_41B6_407672D395B3_0_HS_3_0.png",
   "width": 480,
   "height": 420,
   "class": "ImageResourceLevel"
  }
 ],
 "class": "AnimatedImageResource",
 "colCount": 4,
 "id": "AnimatedImageResource_B5286C41_AF09_656E_41D5_C0E270809CC3",
 "frameDuration": 41
},
{
 "rowCount": 6,
 "frameCount": 21,
 "levels": [
  {
   "url": "media/panorama_2640B699_2C3C_C4FC_4199_0A1F70F8E313_0_HS_1_0.png",
   "width": 480,
   "height": 420,
   "class": "ImageResourceLevel"
  }
 ],
 "class": "AnimatedImageResource",
 "colCount": 4,
 "id": "AnimatedImageResource_7E703AF1_605D_91AA_41D0_AF0B0EAB517F",
 "frameDuration": 41
},
{
 "rowCount": 6,
 "frameCount": 21,
 "levels": [
  {
   "url": "media/panorama_26660E76_2C3C_C437_41C0_4932F3D787B3_0_HS_1_0.png",
   "width": 480,
   "height": 420,
   "class": "ImageResourceLevel"
  }
 ],
 "class": "AnimatedImageResource",
 "colCount": 4,
 "id": "AnimatedImageResource_7E711AEF_605D_91B5_41BD_DE7F806C68F9",
 "frameDuration": 41
},
{
 "rowCount": 6,
 "frameCount": 21,
 "levels": [
  {
   "url": "media/panorama_26660E76_2C3C_C437_41C0_4932F3D787B3_0_HS_3_0.png",
   "width": 480,
   "height": 420,
   "class": "ImageResourceLevel"
  }
 ],
 "class": "AnimatedImageResource",
 "colCount": 4,
 "id": "AnimatedImageResource_7E71AAF0_605D_91AA_416E_4B995B6D8480",
 "frameDuration": 41
},
{
 "rowCount": 6,
 "frameCount": 21,
 "levels": [
  {
   "url": "media/panorama_266659AF_2C3C_4CD5_41A2_2211D54F0994_0_HS_1_0.png",
   "width": 480,
   "height": 420,
   "class": "ImageResourceLevel"
  }
 ],
 "class": "AnimatedImageResource",
 "colCount": 4,
 "id": "AnimatedImageResource_7B4B902A_607C_B0BE_41CD_68292A06C0AD",
 "frameDuration": 41
},
{
 "rowCount": 6,
 "frameCount": 21,
 "levels": [
  {
   "url": "media/panorama_266659AF_2C3C_4CD5_41A2_2211D54F0994_0_HS_3_0.png",
   "width": 480,
   "height": 420,
   "class": "ImageResourceLevel"
  }
 ],
 "class": "AnimatedImageResource",
 "colCount": 4,
 "id": "AnimatedImageResource_8B5D5992_AF0A_AF12_41B2_D6581B585D97",
 "frameDuration": 41
},
{
 "rowCount": 6,
 "frameCount": 21,
 "levels": [
  {
   "url": "media/panorama_2669E37C_2C3F_DC3B_41AF_EA365FC497F6_0_HS_1_0.png",
   "width": 480,
   "height": 420,
   "class": "ImageResourceLevel"
  }
 ],
 "class": "AnimatedImageResource",
 "colCount": 4,
 "id": "AnimatedImageResource_7B4A302A_607C_B0BE_41A8_A6F665240DDF",
 "frameDuration": 41
},
{
 "rowCount": 6,
 "frameCount": 21,
 "levels": [
  {
   "url": "media/panorama_2669A39A_2C3C_5CFF_41C0_F596914DA092_0_HS_1_0.png",
   "width": 480,
   "height": 420,
   "class": "ImageResourceLevel"
  }
 ],
 "class": "AnimatedImageResource",
 "colCount": 4,
 "id": "AnimatedImageResource_76F37689_605C_907A_41CA_3FCB6C7744C5",
 "frameDuration": 41
},
{
 "rowCount": 6,
 "frameCount": 21,
 "levels": [
  {
   "url": "media/panorama_2669A39A_2C3C_5CFF_41C0_F596914DA092_0_HS_3_0.png",
   "width": 480,
   "height": 420,
   "class": "ImageResourceLevel"
  }
 ],
 "class": "AnimatedImageResource",
 "colCount": 4,
 "id": "AnimatedImageResource_76F4E689_605C_907A_41C1_72C965E0DEB2",
 "frameDuration": 41
},
{
 "rowCount": 6,
 "frameCount": 21,
 "levels": [
  {
   "url": "media/panorama_2669D8F8_2C3F_CC3B_41C4_43F82B11C465_0_HS_1_0.png",
   "width": 480,
   "height": 420,
   "class": "ImageResourceLevel"
  }
 ],
 "class": "AnimatedImageResource",
 "colCount": 4,
 "id": "AnimatedImageResource_7B494028_607C_B0BA_41D1_B65F23D3BA1D",
 "frameDuration": 41
},
{
 "rowCount": 6,
 "frameCount": 21,
 "levels": [
  {
   "url": "media/panorama_2669D8F8_2C3F_CC3B_41C4_43F82B11C465_0_HS_3_0.png",
   "width": 480,
   "height": 420,
   "class": "ImageResourceLevel"
  }
 ],
 "class": "AnimatedImageResource",
 "colCount": 4,
 "id": "AnimatedImageResource_7B4AA029_607C_B0BA_41C3_58B8DA83233B",
 "frameDuration": 41
},
{
 "rowCount": 6,
 "frameCount": 21,
 "levels": [
  {
   "url": "media/panorama_274E4A2E_2C3D_CFD7_41C3_E749466BFD9F_0_HS_1_0.png",
   "width": 480,
   "height": 420,
   "class": "ImageResourceLevel"
  }
 ],
 "class": "AnimatedImageResource",
 "colCount": 4,
 "id": "AnimatedImageResource_3F020CDC_2C44_C474_41AB_8E87A08914E1",
 "frameDuration": 41
},
{
 "rowCount": 6,
 "frameCount": 21,
 "levels": [
  {
   "url": "media/panorama_274E4A2E_2C3D_CFD7_41C3_E749466BFD9F_0_HS_3_0.png",
   "width": 480,
   "height": 420,
   "class": "ImageResourceLevel"
  }
 ],
 "class": "AnimatedImageResource",
 "colCount": 4,
 "id": "AnimatedImageResource_39FD02E1_2C3D_FC4D_41C3_B2F6935FFDEB",
 "frameDuration": 41
},
{
 "rowCount": 6,
 "frameCount": 21,
 "levels": [
  {
   "url": "media/panorama_26667DFA_2C3C_443C_41B2_332913C8F61A_0_HS_1_0.png",
   "width": 480,
   "height": 420,
   "class": "ImageResourceLevel"
  }
 ],
 "class": "AnimatedImageResource",
 "colCount": 4,
 "id": "AnimatedImageResource_4C4D0777_55BF_A859_41C5_D4C12DB4CF4C",
 "frameDuration": 41
},
{
 "rowCount": 6,
 "frameCount": 21,
 "levels": [
  {
   "url": "media/panorama_26667DFA_2C3C_443C_41B2_332913C8F61A_0_HS_3_0.png",
   "width": 480,
   "height": 420,
   "class": "ImageResourceLevel"
  }
 ],
 "class": "AnimatedImageResource",
 "colCount": 4,
 "id": "AnimatedImageResource_4C4D3777_55BF_A859_41D3_2FA3B86CEA01",
 "frameDuration": 41
},
{
 "rowCount": 6,
 "frameCount": 21,
 "levels": [
  {
   "url": "media/panorama_266A2362_2C3C_7C4F_41C5_86D5259F47A8_0_HS_1_0.png",
   "width": 480,
   "height": 420,
   "class": "ImageResourceLevel"
  }
 ],
 "class": "AnimatedImageResource",
 "colCount": 4,
 "id": "AnimatedImageResource_3846CF48_2CC4_445B_41C4_CE98C0375D24",
 "frameDuration": 41
},
{
 "rowCount": 6,
 "frameCount": 24,
 "levels": [
  {
   "url": "media/panorama_266A2362_2C3C_7C4F_41C5_86D5259F47A8_0_HS_5_0.png",
   "width": 560,
   "height": 300,
   "class": "ImageResourceLevel"
  }
 ],
 "class": "AnimatedImageResource",
 "colCount": 4,
 "id": "AnimatedImageResource_3B16961F_2CDC_C7F5_41AD_53BF33697116",
 "frameDuration": 41
},
{
 "rowCount": 6,
 "frameCount": 21,
 "levels": [
  {
   "url": "media/panorama_266A2362_2C3C_7C4F_41C5_86D5259F47A8_0_HS_7_0.png",
   "width": 480,
   "height": 420,
   "class": "ImageResourceLevel"
  }
 ],
 "class": "AnimatedImageResource",
 "colCount": 4,
 "id": "AnimatedImageResource_3BFD00E0_2CDC_7C4B_419D_C82FC8908BDD",
 "frameDuration": 41
},
{
 "rowCount": 6,
 "frameCount": 21,
 "levels": [
  {
   "url": "media/panorama_2669B134_2C3F_DDCB_41BB_88BE90D98D45_0_HS_1_0.png",
   "width": 480,
   "height": 420,
   "class": "ImageResourceLevel"
  }
 ],
 "class": "AnimatedImageResource",
 "colCount": 4,
 "id": "AnimatedImageResource_76A2A031_6027_9503_41C4_2C882152374F",
 "frameDuration": 41
},
{
 "rowCount": 6,
 "frameCount": 21,
 "levels": [
  {
   "url": "media/panorama_2669B134_2C3F_DDCB_41BB_88BE90D98D45_0_HS_3_0.png",
   "width": 480,
   "height": 420,
   "class": "ImageResourceLevel"
  }
 ],
 "class": "AnimatedImageResource",
 "colCount": 4,
 "id": "AnimatedImageResource_76A30031_6027_9503_41C8_4DFDDCEA07DE",
 "frameDuration": 41
},
{
 "rowCount": 6,
 "frameCount": 21,
 "levels": [
  {
   "url": "media/panorama_2669B134_2C3F_DDCB_41BB_88BE90D98D45_0_HS_5_0.png",
   "width": 480,
   "height": 420,
   "class": "ImageResourceLevel"
  }
 ],
 "class": "AnimatedImageResource",
 "colCount": 4,
 "id": "AnimatedImageResource_7B48F026_607C_B0B6_41CE_46EF7C031804",
 "frameDuration": 41
},
{
 "rowCount": 6,
 "frameCount": 21,
 "levels": [
  {
   "url": "media/panorama_266A7DB6_2C3C_4437_41C1_235AEE268532_0_HS_1_0.png",
   "width": 480,
   "height": 420,
   "class": "ImageResourceLevel"
  }
 ],
 "class": "AnimatedImageResource",
 "colCount": 4,
 "id": "AnimatedImageResource_B4D8B9D4_AF0A_AF16_41BE_BAFFC86D4413",
 "frameDuration": 41
},
{
 "rowCount": 6,
 "frameCount": 21,
 "levels": [
  {
   "url": "media/panorama_266A7DB6_2C3C_4437_41C1_235AEE268532_0_HS_3_0.png",
   "width": 480,
   "height": 420,
   "class": "ImageResourceLevel"
  }
 ],
 "class": "AnimatedImageResource",
 "colCount": 4,
 "id": "AnimatedImageResource_B4D8E9D5_AF0A_AF16_41DE_A57F56BE6983",
 "frameDuration": 41
},
{
 "rowCount": 6,
 "frameCount": 21,
 "levels": [
  {
   "url": "media/panorama_266A7DB6_2C3C_4437_41C1_235AEE268532_0_HS_5_0.png",
   "width": 480,
   "height": 420,
   "class": "ImageResourceLevel"
  }
 ],
 "class": "AnimatedImageResource",
 "colCount": 4,
 "id": "AnimatedImageResource_B4D839D7_AF0A_AF12_41E5_DB5CE1E0F900",
 "frameDuration": 41
},
{
 "rowCount": 6,
 "frameCount": 21,
 "levels": [
  {
   "url": "media/panorama_2666F3DA_2C3C_BC7F_41A5_8719A461067F_0_HS_1_0.png",
   "width": 480,
   "height": 420,
   "class": "ImageResourceLevel"
  }
 ],
 "class": "AnimatedImageResource",
 "colCount": 4,
 "id": "AnimatedImageResource_432DF17C_554A_A84F_41CB_EE880CB935AF",
 "frameDuration": 41
},
{
 "rowCount": 6,
 "frameCount": 21,
 "levels": [
  {
   "url": "media/panorama_2666F3DA_2C3C_BC7F_41A5_8719A461067F_0_HS_5_0.png",
   "width": 480,
   "height": 420,
   "class": "ImageResourceLevel"
  }
 ],
 "class": "AnimatedImageResource",
 "colCount": 4,
 "id": "AnimatedImageResource_41B1D533_5546_A9D9_41B9_E8E05922A272",
 "frameDuration": 41
},
{
 "rowCount": 6,
 "frameCount": 21,
 "levels": [
  {
   "url": "media/panorama_26667EAB_2C3C_44DC_41BD_508AF18BD0E5_0_HS_1_0.png",
   "width": 480,
   "height": 420,
   "class": "ImageResourceLevel"
  }
 ],
 "class": "AnimatedImageResource",
 "colCount": 4,
 "id": "AnimatedImageResource_39FD82E1_2C3D_FC4D_418D_C2583A2D9F7D",
 "frameDuration": 41
},
{
 "rowCount": 6,
 "frameCount": 21,
 "levels": [
  {
   "url": "media/panorama_26667EAB_2C3C_44DC_41BD_508AF18BD0E5_0_HS_3_0.png",
   "width": 480,
   "height": 420,
   "class": "ImageResourceLevel"
  }
 ],
 "class": "AnimatedImageResource",
 "colCount": 4,
 "id": "AnimatedImageResource_3905BD79_2C3F_C43C_41AA_AD2C74CC4FE5",
 "frameDuration": 41
},
{
 "rowCount": 6,
 "frameCount": 21,
 "levels": [
  {
   "url": "media/panorama_266A4FDB_2C3C_447D_41C1_296818159F21_0_HS_1_0.png",
   "width": 480,
   "height": 420,
   "class": "ImageResourceLevel"
  }
 ],
 "class": "AnimatedImageResource",
 "colCount": 4,
 "id": "AnimatedImageResource_46A272F9_60EF_919A_41D3_FF32345C4B3C",
 "frameDuration": 41
},
{
 "rowCount": 6,
 "frameCount": 21,
 "levels": [
  {
   "url": "media/panorama_266A5334_2C3C_BDCB_41C0_5ECFC0F03DE9_0_HS_1_0.png",
   "width": 480,
   "height": 420,
   "class": "ImageResourceLevel"
  }
 ],
 "class": "AnimatedImageResource",
 "colCount": 4,
 "id": "AnimatedImageResource_46ACA2F8_60EF_919A_41D3_C048FE8FFDE1",
 "frameDuration": 41
},
{
 "rowCount": 6,
 "frameCount": 21,
 "levels": [
  {
   "url": "media/panorama_266A5334_2C3C_BDCB_41C0_5ECFC0F03DE9_0_HS_3_0.png",
   "width": 480,
   "height": 420,
   "class": "ImageResourceLevel"
  }
 ],
 "class": "AnimatedImageResource",
 "colCount": 4,
 "id": "AnimatedImageResource_46AD22F8_60EF_919A_4151_A5053AD75BB8",
 "frameDuration": 41
},
{
 "rowCount": 6,
 "frameCount": 21,
 "levels": [
  {
   "url": "media/panorama_2666F540_2C3C_C44C_41C0_1FA76F1EECB2_0_HS_1_0.png",
   "width": 480,
   "height": 420,
   "class": "ImageResourceLevel"
  }
 ],
 "class": "AnimatedImageResource",
 "colCount": 4,
 "id": "AnimatedImageResource_7E726AEC_605D_91BA_41C9_70EB44E1BCCD",
 "frameDuration": 41
},
{
 "rowCount": 6,
 "frameCount": 21,
 "levels": [
  {
   "url": "media/panorama_2666F540_2C3C_C44C_41C0_1FA76F1EECB2_0_HS_3_0.png",
   "width": 480,
   "height": 420,
   "class": "ImageResourceLevel"
  }
 ],
 "class": "AnimatedImageResource",
 "colCount": 4,
 "id": "AnimatedImageResource_7E72CAEE_605D_91B7_41D6_B89D863B1BB6",
 "frameDuration": 41
},
{
 "rowCount": 6,
 "frameCount": 21,
 "levels": [
  {
   "url": "media/panorama_266AA6A9_2C3C_44DD_4132_A3FBEF2422DE_0_HS_1_0.png",
   "width": 480,
   "height": 420,
   "class": "ImageResourceLevel"
  }
 ],
 "class": "AnimatedImageResource",
 "colCount": 4,
 "id": "AnimatedImageResource_B37FB8A9_AF09_AD3E_41E3_FA1CA5354793",
 "frameDuration": 41
},
{
 "rowCount": 6,
 "frameCount": 21,
 "levels": [
  {
   "url": "media/panorama_266AA6A9_2C3C_44DD_4132_A3FBEF2422DE_0_HS_3_0.png",
   "width": 480,
   "height": 420,
   "class": "ImageResourceLevel"
  }
 ],
 "class": "AnimatedImageResource",
 "colCount": 4,
 "id": "AnimatedImageResource_B30F8C23_AF3A_A532_41D8_F8EE9845B78E",
 "frameDuration": 41
},
{
 "rowCount": 6,
 "frameCount": 21,
 "levels": [
  {
   "url": "media/panorama_26661FEC_2C3C_C45B_419B_861471116CC7_0_HS_1_0.png",
   "width": 480,
   "height": 420,
   "class": "ImageResourceLevel"
  }
 ],
 "class": "AnimatedImageResource",
 "colCount": 4,
 "id": "AnimatedImageResource_8B5029B9_AF0A_AF1E_41DB_2AAE06DC11A2",
 "frameDuration": 41
},
{
 "rowCount": 6,
 "frameCount": 21,
 "levels": [
  {
   "url": "media/panorama_26664293_2C3C_5CCD_41B6_BA5F5C9DBD4C_0_HS_1_0.png",
   "width": 480,
   "height": 420,
   "class": "ImageResourceLevel"
  }
 ],
 "class": "AnimatedImageResource",
 "colCount": 4,
 "id": "AnimatedImageResource_4D4BD91E_554B_F9CB_41A6_AC5220473D09",
 "frameDuration": 41
},
{
 "rowCount": 6,
 "frameCount": 21,
 "levels": [
  {
   "url": "media/panorama_26664293_2C3C_5CCD_41B6_BA5F5C9DBD4C_0_HS_7_0.png",
   "width": 480,
   "height": 420,
   "class": "ImageResourceLevel"
  }
 ],
 "class": "AnimatedImageResource",
 "colCount": 4,
 "id": "AnimatedImageResource_7B76B6D9_6064_919D_41C4_D5188F7AD184",
 "frameDuration": 41
},
{
 "rowCount": 6,
 "frameCount": 21,
 "levels": [
  {
   "url": "media/panorama_26664293_2C3C_5CCD_41B6_BA5F5C9DBD4C_0_HS_9_0.png",
   "width": 480,
   "height": 420,
   "class": "ImageResourceLevel"
  }
 ],
 "class": "AnimatedImageResource",
 "colCount": 4,
 "id": "AnimatedImageResource_7E73DAEB_605D_91BD_41BF_E1A1381AEE7E",
 "frameDuration": 41
},
{
 "rowCount": 6,
 "frameCount": 21,
 "levels": [
  {
   "url": "media/panorama_266ABC73_2C3C_444D_41A2_D12FEAAC1356_0_HS_2_0.png",
   "width": 480,
   "height": 420,
   "class": "ImageResourceLevel"
  }
 ],
 "class": "AnimatedImageResource",
 "colCount": 4,
 "id": "AnimatedImageResource_B4DB19E7_AF0A_AF32_41E4_58F2B1C511ED",
 "frameDuration": 41
},
{
 "rowCount": 6,
 "frameCount": 21,
 "levels": [
  {
   "url": "media/panorama_266ABC73_2C3C_444D_41A2_D12FEAAC1356_0_HS_3_0.png",
   "width": 480,
   "height": 420,
   "class": "ImageResourceLevel"
  }
 ],
 "class": "AnimatedImageResource",
 "colCount": 4,
 "id": "AnimatedImageResource_B031C32B_AF07_A332_41C4_1B1DE9DC8480",
 "frameDuration": 41
},
{
 "rowCount": 6,
 "frameCount": 21,
 "levels": [
  {
   "url": "media/panorama_2669CA02_2C3F_CFCF_41C1_E694A5B56234_0_HS_1_0.png",
   "width": 480,
   "height": 420,
   "class": "ImageResourceLevel"
  }
 ],
 "class": "AnimatedImageResource",
 "colCount": 4,
 "id": "AnimatedImageResource_7B484026_607C_B0B6_41CB_C8E4959C7DDB",
 "frameDuration": 41
},
{
 "rowCount": 6,
 "frameCount": 21,
 "levels": [
  {
   "url": "media/panorama_2669CA02_2C3F_CFCF_41C1_E694A5B56234_0_HS_3_0.png",
   "width": 480,
   "height": 420,
   "class": "ImageResourceLevel"
  }
 ],
 "class": "AnimatedImageResource",
 "colCount": 4,
 "id": "AnimatedImageResource_7B49F027_607C_B0B6_41D3_986C5E82172D",
 "frameDuration": 41
},
{
 "rowCount": 6,
 "frameCount": 21,
 "levels": [
  {
   "url": "media/panorama_264C2F16_2C3C_C5F7_41C0_5EA2911E8144_0_HS_1_0.png",
   "width": 480,
   "height": 420,
   "class": "ImageResourceLevel"
  }
 ],
 "class": "AnimatedImageResource",
 "colCount": 4,
 "id": "AnimatedImageResource_8BED81D8_AF7E_FF1E_41CC_F2F3478C7825",
 "frameDuration": 41
},
{
 "rowCount": 6,
 "frameCount": 21,
 "levels": [
  {
   "url": "media/panorama_264C2F16_2C3C_C5F7_41C0_5EA2911E8144_0_HS_3_0.png",
   "width": 480,
   "height": 420,
   "class": "ImageResourceLevel"
  }
 ],
 "class": "AnimatedImageResource",
 "colCount": 4,
 "id": "AnimatedImageResource_8B5639AF_AF0A_AF0D_41C6_B356B092444A",
 "frameDuration": 41
},
{
 "rowCount": 6,
 "frameCount": 21,
 "levels": [
  {
   "url": "media/panorama_266A40B1_2C3C_7CCD_41B2_B5FCEE869E17_0_HS_1_0.png",
   "width": 480,
   "height": 420,
   "class": "ImageResourceLevel"
  }
 ],
 "class": "AnimatedImageResource",
 "colCount": 4,
 "id": "AnimatedImageResource_46AE52F5_60EF_91AA_41D2_FCAAE7D8E209",
 "frameDuration": 41
},
{
 "rowCount": 6,
 "frameCount": 21,
 "levels": [
  {
   "url": "media/panorama_266A40B1_2C3C_7CCD_41B2_B5FCEE869E17_0_HS_3_0.png",
   "width": 480,
   "height": 420,
   "class": "ImageResourceLevel"
  }
 ],
 "class": "AnimatedImageResource",
 "colCount": 4,
 "id": "AnimatedImageResource_46AED2F5_60EF_91AA_41D1_05D523E7EDC8",
 "frameDuration": 41
},
{
 "rowCount": 6,
 "frameCount": 21,
 "levels": [
  {
   "url": "media/panorama_266A40B1_2C3C_7CCD_41B2_B5FCEE869E17_0_HS_5_0.png",
   "width": 480,
   "height": 420,
   "class": "ImageResourceLevel"
  }
 ],
 "class": "AnimatedImageResource",
 "colCount": 4,
 "id": "AnimatedImageResource_46AF32F6_60EF_9196_41D4_8020DBFBA78A",
 "frameDuration": 41
},
{
 "rowCount": 6,
 "frameCount": 21,
 "levels": [
  {
   "url": "media/panorama_266A5CEF_2C3C_4455_41A5_2CBA724838F2_0_HS_1_0.png",
   "width": 480,
   "height": 420,
   "class": "ImageResourceLevel"
  }
 ],
 "class": "AnimatedImageResource",
 "colCount": 4,
 "id": "AnimatedImageResource_3E4ADB65_2D8E_CC39_41BA_C17969E30F6A",
 "frameDuration": 41
},
{
 "rowCount": 6,
 "frameCount": 21,
 "levels": [
  {
   "url": "media/panorama_266A5CEF_2C3C_4455_41A5_2CBA724838F2_0_HS_3_0.png",
   "width": 480,
   "height": 420,
   "class": "ImageResourceLevel"
  }
 ],
 "class": "AnimatedImageResource",
 "colCount": 4,
 "id": "AnimatedImageResource_3A32ADE6_2DBA_C43B_41C4_3C05A7D5974C",
 "frameDuration": 41
},
{
 "rowCount": 6,
 "frameCount": 21,
 "levels": [
  {
   "url": "media/panorama_26666712_2C3C_C5CF_4198_822E2A8C8DCC_0_HS_1_0.png",
   "width": 480,
   "height": 420,
   "class": "ImageResourceLevel"
  }
 ],
 "class": "AnimatedImageResource",
 "colCount": 4,
 "id": "AnimatedImageResource_8BEC11D9_AF7E_FF1E_41C5_9A642F66D73D",
 "frameDuration": 41
},
{
 "rowCount": 6,
 "frameCount": 21,
 "levels": [
  {
   "url": "media/panorama_26666712_2C3C_C5CF_4198_822E2A8C8DCC_0_HS_3_0.png",
   "width": 480,
   "height": 420,
   "class": "ImageResourceLevel"
  }
 ],
 "class": "AnimatedImageResource",
 "colCount": 4,
 "id": "AnimatedImageResource_8BF3A1DF_AF7E_FF12_41D5_AC78FF4FB651",
 "frameDuration": 41
},
{
 "rowCount": 6,
 "frameCount": 21,
 "levels": [
  {
   "url": "media/panorama_2666CCAC_2C3C_C4D4_41B6_6F5BD1BACD46_0_HS_7_0.png",
   "width": 420,
   "height": 330,
   "class": "ImageResourceLevel"
  }
 ],
 "class": "AnimatedImageResource",
 "colCount": 4,
 "id": "AnimatedImageResource_3BD7DA84_2D85_4CFF_41C0_A83123AD5973",
 "frameDuration": 41
},
{
 "rowCount": 6,
 "frameCount": 21,
 "levels": [
  {
   "url": "media/panorama_2666CCAC_2C3C_C4D4_41B6_6F5BD1BACD46_0_HS_9_0.png",
   "width": 480,
   "height": 420,
   "class": "ImageResourceLevel"
  }
 ],
 "class": "AnimatedImageResource",
 "colCount": 4,
 "id": "AnimatedImageResource_3AF8B4FE_2D87_440B_41B9_98B805F79E33",
 "frameDuration": 41
},
{
 "rowCount": 6,
 "frameCount": 21,
 "levels": [
  {
   "url": "media/panorama_26663B80_2C3C_4CCC_41C4_05539F545C2A_0_HS_1_0.png",
   "width": 480,
   "height": 420,
   "class": "ImageResourceLevel"
  }
 ],
 "class": "AnimatedImageResource",
 "colCount": 4,
 "id": "AnimatedImageResource_426B20EF_557A_A84A_41BD_86F4ADC9B8D4",
 "frameDuration": 41
},
{
 "rowCount": 6,
 "frameCount": 21,
 "levels": [
  {
   "url": "media/panorama_26663B80_2C3C_4CCC_41C4_05539F545C2A_0_HS_3_0.png",
   "width": 480,
   "height": 420,
   "class": "ImageResourceLevel"
  }
 ],
 "class": "AnimatedImageResource",
 "colCount": 4,
 "id": "AnimatedImageResource_4274A0EF_557A_A84A_41C8_5ED46874DD11",
 "frameDuration": 41
},
{
 "rowCount": 6,
 "frameCount": 21,
 "levels": [
  {
   "url": "media/panorama_266A36EB_2C3C_C45D_41A9_B83C69110285_0_HS_1_0.png",
   "width": 480,
   "height": 420,
   "class": "ImageResourceLevel"
  }
 ],
 "class": "AnimatedImageResource",
 "colCount": 4,
 "id": "AnimatedImageResource_B378C89E_AF09_AD12_41E1_093F1C824BC9",
 "frameDuration": 41
},
{
 "rowCount": 6,
 "frameCount": 21,
 "levels": [
  {
   "url": "media/panorama_266A36EB_2C3C_C45D_41A9_B83C69110285_0_HS_3_0.png",
   "width": 480,
   "height": 420,
   "class": "ImageResourceLevel"
  }
 ],
 "class": "AnimatedImageResource",
 "colCount": 4,
 "id": "AnimatedImageResource_B30C5C18_AF3A_A51E_41BB_B8A417EF1A5B",
 "frameDuration": 41
},
{
 "rowCount": 6,
 "frameCount": 21,
 "levels": [
  {
   "url": "media/panorama_266AF94D_2C3C_CC54_4196_59CC1A2DCC79_0_HS_1_0.png",
   "width": 480,
   "height": 420,
   "class": "ImageResourceLevel"
  }
 ],
 "class": "AnimatedImageResource",
 "colCount": 4,
 "id": "AnimatedImageResource_B37AF899_AF09_AD1E_41E0_47F63B2E5918",
 "frameDuration": 41
},
{
 "rowCount": 6,
 "frameCount": 21,
 "levels": [
  {
   "url": "media/panorama_2669CEC5_2C3F_C455_41C1_4FFEA2873441_0_HS_3_0.png",
   "width": 480,
   "height": 420,
   "class": "ImageResourceLevel"
  }
 ],
 "class": "AnimatedImageResource",
 "colCount": 4,
 "id": "AnimatedImageResource_875D2222_AF1B_5D32_41D6_F5EB350D9AFE",
 "frameDuration": 41
},
{
 "rowCount": 6,
 "frameCount": 21,
 "levels": [
  {
   "url": "media/panorama_266ACD16_2C3C_C5F4_41C4_48EB0653785E_0_HS_1_0.png",
   "width": 480,
   "height": 420,
   "class": "ImageResourceLevel"
  }
 ],
 "class": "AnimatedImageResource",
 "colCount": 4,
 "id": "AnimatedImageResource_B37BB89A_AF09_AD12_41BA_DCDF2992136E",
 "frameDuration": 41
},
{
 "rowCount": 6,
 "frameCount": 21,
 "levels": [
  {
   "url": "media/panorama_266ACD16_2C3C_C5F4_41C4_48EB0653785E_0_HS_3_0.png",
   "width": 480,
   "height": 420,
   "class": "ImageResourceLevel"
  }
 ],
 "class": "AnimatedImageResource",
 "colCount": 4,
 "id": "AnimatedImageResource_B0332323_AF07_A332_41CC_F4703A952313",
 "frameDuration": 41
},
{
 "rowCount": 6,
 "frameCount": 21,
 "levels": [
  {
   "url": "media/panorama_2650731A_2C3C_7DFF_41BF_42020C9917DD_0_HS_1_0.png",
   "width": 480,
   "height": 420,
   "class": "ImageResourceLevel"
  }
 ],
 "class": "AnimatedImageResource",
 "colCount": 4,
 "id": "AnimatedImageResource_82D2827A_AF0A_DD12_41E2_2F75E24A1068",
 "frameDuration": 41
}],
 "minHeight": 20,
 "width": "100%",
 "data": {
  "name": "Player52817"
 }
};

    
    function HistoryData(playList) {
        this.playList = playList;
        this.list = [];
        this.pointer = -1;
    }

    HistoryData.prototype.add = function(index){
        if(this.pointer < this.list.length && this.list[this.pointer] == index) {
            return;
        }
        ++this.pointer;
        this.list.splice(this.pointer, this.list.length - this.pointer, index);
    };

    HistoryData.prototype.back = function(){
        if(!this.canBack()) return;
        this.playList.set('selectedIndex', this.list[--this.pointer]);
    };

    HistoryData.prototype.forward = function(){
        if(!this.canForward()) return;
        this.playList.set('selectedIndex', this.list[++this.pointer]);
    };

    HistoryData.prototype.canBack = function(){
        return this.pointer > 0;
    };

    HistoryData.prototype.canForward = function(){
        return this.pointer >= 0 && this.pointer < this.list.length-1;
    };
    //

    if(script.data == undefined)
        script.data = {};
    script.data["history"] = {};    //playListID -> HistoryData

    TDV.PlayerAPI.defineScript(script);
})();
