/* @license GNU-GPL-2.0-or-later https://www.drupal.org/licensing/faq */
(function(_,$,Drupal,drupalSettings){'use strict';var Bootstrap={processedOnce:{},settings:drupalSettings.bootstrap||{}};Bootstrap.checkPlain=function(str){return str&&Drupal.checkPlain(str)||'';};Bootstrap.createPlugin=function(id,plugin,noConflict){if($.fn[id]!==void 0)return this.fatal('Specified jQuery plugin identifier already exists: @id. Use Drupal.bootstrap.replacePlugin() instead.',{'@id':id});if(typeof plugin!=='function')return this.fatal('You must provide a constructor function to create a jQuery plugin "@id": @plugin',{'@id':id,'@plugin':plugin});this.pluginNoConflict(id,plugin,noConflict);$.fn[id]=plugin;};Bootstrap.diffObjects=function(objects){var args=Array.prototype.slice.call(arguments);return _.pick(args[0],_.difference.apply(_,_.map(args,function(obj){return Object.keys(obj);})));};Bootstrap.eventMap={Event:/^(?:load|unload|abort|error|select|change|submit|reset|focus|blur|resize|scroll)$/,MouseEvent:/^(?:click|dblclick|mouse(?:down|enter|leave|up|over|move|out))$/,KeyboardEvent:/^(?:key(?:down|press|up))$/,TouchEvent:/^(?:touch(?:start|end|move|cancel))$/};Bootstrap.extendPlugin=function(id,callback){if(typeof $.fn[id]!=='function')return this.fatal('Specified jQuery plugin identifier does not exist: @id',{'@id':id});if(typeof callback!=='function')return this.fatal('You must provide a callback function to extend the jQuery plugin "@id": @callback',{'@id':id,'@callback':callback});var constructor=$.fn[id]&&$.fn[id].Constructor||$.fn[id];var plugin=callback.apply(constructor,[this.settings]);if(!$.isPlainObject(plugin))return this.fatal('Returned value from callback is not a plain object that can be used to extend the jQuery plugin "@id": @obj',{'@obj':plugin});this.wrapPluginConstructor(constructor,plugin,true);return $.fn[id];};Bootstrap.superWrapper=function(parent,fn){return function(){var previousSuper=this.super;this.super=parent;var ret=fn.apply(this,arguments);if(previousSuper)this.super=previousSuper;else delete this.super;return ret;};};Bootstrap.fatal=function(message,args){if(this.settings.dev&&console.warn){for(var name in args)if(args.hasOwnProperty(name)&&typeof args[name]==='object')args[name]=JSON.stringify(args[name]);Drupal.throwError(new Error(Drupal.formatString(message,args)));}return false;};Bootstrap.intersectObjects=function(objects){var args=Array.prototype.slice.call(arguments);return _.pick(args[0],_.intersection.apply(_,_.map(args,function(obj){return Object.keys(obj);})));};Bootstrap.normalizeObject=function(obj){if(!$.isPlainObject(obj))return obj;for(var k in obj)if(typeof obj[k]==='string')if(obj[k]==='true')obj[k]=true;else if(obj[k]==='false')obj[k]=false;else{if(obj[k].match(/^[\d-.]$/))obj[k]=parseFloat(obj[k]);}else{if($.isPlainObject(obj[k]))obj[k]=Bootstrap.normalizeObject(obj[k]);}return obj;};Bootstrap.once=function(id,callback){if(this.processedOnce[id])return this;callback.call(this,this.settings);this.processedOnce[id]=true;return this;};Bootstrap.option=function(key,value){var options=$.isPlainObject(key)?$.extend({},key):{};if(arguments.length===0)return $.extend({},this.options);if(typeof key==="string"){var parts=key.split('.');key=parts.shift();var obj=options;if(parts.length){for(var i=0;i<parts.length-1;i++){obj[parts[i]]=obj[parts[i]]||{};obj=obj[parts[i]];}key=parts.pop();}if(arguments.length===1)return obj[key]===void 0?null:obj[key];obj[key]=value;}$.extend(true,this.options,options);};Bootstrap.pluginNoConflict=function(id,plugin,noConflict){if(plugin.noConflict===void 0&&(noConflict===void 0||noConflict)){var old=$.fn[id];plugin.noConflict=function(){$.fn[id]=old;return this;};}};Bootstrap.relayEvent=function(target,name,stopPropagation){return function(e){if(stopPropagation===void 0||stopPropagation)e.stopPropagation();var $target=$(target);var parts=name.split('.').filter(Boolean);var type=parts.shift();e.target=$target[0];e.currentTarget=$target[0];e.namespace=parts.join('.');e.type=type;$target.trigger(e);};};Bootstrap.replacePlugin=function(id,callback,noConflict){if(typeof $.fn[id]!=='function')return this.fatal('Specified jQuery plugin identifier does not exist: @id',{'@id':id});if(typeof callback!=='function')return this.fatal('You must provide a valid callback function to replace a jQuery plugin: @callback',{'@callback':callback});var constructor=$.fn[id]&&$.fn[id].Constructor||$.fn[id];var plugin=callback.apply(constructor,[this.settings]);if(typeof plugin!=='function')return this.fatal('Returned value from callback is not a usable function to replace a jQuery plugin "@id": @plugin',{'@id':id,'@plugin':plugin});this.wrapPluginConstructor(constructor,plugin);this.pluginNoConflict(id,plugin,noConflict);$.fn[id]=plugin;};Bootstrap.simulate=function(element,type,options){var ret=true;if(element instanceof $){element.each(function(){if(!Bootstrap.simulate(this,type,options))ret=false;});return ret;}if(!(element instanceof HTMLElement))this.fatal('Passed element must be an instance of HTMLElement, got "@type" instead.',{'@type':typeof element});if(typeof $.simulate==='function'){new $.simulate(element,type,options);return true;}var event;var ctor;var types=[].concat(type);for(var i=0,l=types.length;i<l;i++){type=types[i];for(var name in this.eventMap)if(this.eventMap[name].test(type)){ctor=name;break;}if(!ctor)throw new SyntaxError('Only rudimentary HTMLEvents, KeyboardEvents and MouseEvents are supported: '+type);var opts={bubbles:true,cancelable:true};if(ctor==='KeyboardEvent'||ctor==='MouseEvent')$.extend(opts,{ctrlKey:!1,altKey:!1,shiftKey:!1,metaKey:!1});if(ctor==='MouseEvent')$.extend(opts,{button:0,pointerX:0,pointerY:0,view:window});if(options)$.extend(opts,options);if(typeof window[ctor]==='function'){event=new window[ctor](type,opts);if(!element.dispatchEvent(event))ret=false;}else if(document.createEvent){event=document.createEvent(ctor);event.initEvent(type,opts.bubbles,opts.cancelable);if(!element.dispatchEvent(event))ret=false;}else if(typeof element.fireEvent==='function'){event=$.extend(document.createEventObject(),opts);if(!element.fireEvent('on'+type,event))ret=false;}else{if(typeof element[type])element[type]();}}return ret;};Bootstrap.stripHtml=function(html){if(html instanceof $)html=html.html();else{if(html instanceof Element)html=html.innerHTML;}var tmp=document.createElement('DIV');tmp.innerHTML=html;return (tmp.textContent||tmp.innerText||'').replace(/^[\s\n\t]*|[\s\n\t]*$/,'');};Bootstrap.unsupported=function(type,name,value){Bootstrap.warn('Unsupported by Drupal Bootstrap: (@type) @name -> @value',{'@type':type,'@name':name,'@value':typeof value==='object'?JSON.stringify(value):value});};Bootstrap.warn=function(message,args){if(this.settings.dev&&console.warn)console.warn(Drupal.formatString(message,args));};Bootstrap.wrapPluginConstructor=function(constructor,plugin,extend){var proto=constructor.prototype;var option=this.option;if(proto.option===void (0))proto.option=function(){return option.apply(this,arguments);};if(extend){if(plugin.prototype!==void 0)for(var key in plugin.prototype){if(!plugin.prototype.hasOwnProperty(key))continue;var value=plugin.prototype[key];if(typeof value==='function')proto[key]=this.superWrapper(proto[key]||function(){},value);else proto[key]=$.isPlainObject(value)?$.extend(true,{},proto[key],value):value;}delete plugin.prototype;for(key in plugin){if(!plugin.hasOwnProperty(key))continue;value=plugin[key];if(typeof value==='function')constructor[key]=this.superWrapper(constructor[key]||function(){},value);else constructor[key]=$.isPlainObject(value)?$.extend(true,{},constructor[key],value):value;}}};Drupal.bootstrap=Drupal.bootstrap||Bootstrap;})(window._,window.jQuery,window.Drupal,window.drupalSettings);;
(function($,_){var Attributes=function(attributes){this.data={};this.data['class']=[];this.merge(attributes);};Attributes.prototype.toString=function(){var output='';var name,value;var checkPlain=function(str){return str&&str.toString().replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;').replace(/>/g,'&gt;')||'';};var data=this.getData();for(name in data){if(!data.hasOwnProperty(name))continue;value=data[name];if(_.isFunction(value))value=value();if(_.isObject(value))value=_.values(value);if(_.isArray(value))value=value.join(' ');output+=' '+checkPlain(name)+'="'+checkPlain(value)+'"';}return output;};Attributes.prototype.toPlainObject=function(){var object={};var name,value;var data=this.getData();for(name in data){if(!data.hasOwnProperty(name))continue;value=data[name];if(_.isFunction(value))value=value();if(_.isObject(value))value=_.values(value);if(_.isArray(value))value=value.join(' ');object[name]=value;}return object;};Attributes.prototype.addClass=function(value){var args=Array.prototype.slice.call(arguments);this.data['class']=this.sanitizeClasses(this.data['class'].concat(args));return this;};Attributes.prototype.exists=function(name){return this.data[name]!==void (0)&&this.data[name]!==null;};Attributes.prototype.get=function(name,defaultValue){if(!this.exists(name))this.data[name]=defaultValue;return this.data[name];};Attributes.prototype.getData=function(){return _.extend({},this.data);};Attributes.prototype.getClasses=function(){return this.get('class',[]);};Attributes.prototype.hasClass=function(className){className=this.sanitizeClasses(Array.prototype.slice.call(arguments));var classes=this.getClasses();for(var i=0,l=className.length;i<l;i++)if(_.indexOf(classes,className[i])===-1)return false;return true;};Attributes.prototype.merge=function(object,recursive){if(!object)return this;if(object instanceof $)object=object[0];if(object instanceof Node)object=Array.prototype.slice.call(object.attributes).reduce(function(attributes,attribute){attributes[attribute.name]=attribute.value;return attributes;},{});else if(object instanceof Attributes)object=object.getData();else object=_.extend({},object);if(!$.isPlainObject(object)){setTimeout(function(){throw new Error('Passed object is not supported: '+object);});return this;}if(object&&object['class']!==void 0){this.addClass(object['class']);delete object['class'];}if(recursive===void 0||recursive)this.data=$.extend(true,{},this.data,object);else this.data=$.extend({},this.data,object);return this;};Attributes.prototype.remove=function(name){if(this.exists(name))delete this.data[name];return this;};Attributes.prototype.removeClass=function(className){var remove=this.sanitizeClasses(Array.prototype.slice.apply(arguments));this.data['class']=_.without(this.getClasses(),remove);return this;};Attributes.prototype.replaceClass=function(oldValue,newValue){var classes=this.getClasses();var i=_.indexOf(this.sanitizeClasses(oldValue),classes);if(i>=0){classes[i]=newValue;this.set('class',classes);}return this;};Attributes.prototype.sanitizeClasses=function(classes){return _.chain(Array.prototype.slice.call(arguments)).flatten().map(function(string){return string.split(' ');}).flatten().filter().map(function(value){return Attributes.cleanClass(value);}).uniq().value();};Attributes.prototype.set=function(name,value){var obj=$.isPlainObject(name)?name:{};if(typeof name==='string')obj[name]=value;return this.merge(obj);};Attributes.cleanClass=function(identifier,filter){filter=filter||{' ':'-','_':'-','/':'-','[':'-',']':''};identifier=identifier.toLowerCase();if(filter['__']===void 0)identifier=identifier.replace('__','#DOUBLE_UNDERSCORE#');identifier=identifier.replace(Object.keys(filter),Object.keys(filter).map(function(key){return filter[key];}));if(filter['__']===void 0)identifier=identifier.replace('#DOUBLE_UNDERSCORE#','__');identifier=identifier.replace(/[^\u002D\u0030-\u0039\u0041-\u005A\u005F\u0061-\u007A\u00A1-\uFFFF]/g,'');identifier=identifier.replace(['/^[0-9]/','/^(-[0-9])|^(--)/'],['_','__']);return identifier;};Attributes.create=function(attributes){return new Attributes(attributes);};window.Attributes=Attributes;})(window.jQuery,window._);;
(function($,Drupal,Bootstrap,Attributes){if(!Drupal.icon)Drupal.icon={bundles:{}};if(!Drupal.theme.icon||Drupal.theme.prototype.icon)$.extend(Drupal.theme,{icon:function(bundle,icon,attributes){if(!Drupal.icon.bundles[bundle])return '';attributes=Attributes.create(attributes).addClass('icon').set('aria-hidden','true');icon=Drupal.icon.bundles[bundle](icon,attributes);return '<span'+attributes+'></span>';}});Drupal.icon.bundles.bootstrap=function(icon,attributes){attributes.addClass(['glyphicon','glyphicon-'+icon]);};$.extend(Drupal.theme,{ajaxThrobber:function(){return Drupal.theme('bootstrapIcon','refresh',{'class':['ajax-throbber','glyphicon-spin']});},button:function(attributes){attributes=Attributes.create(attributes).addClass('btn');var context=attributes.get('context','default');var label=attributes.get('value','');attributes.remove('context').remove('value');if(!attributes.hasClass(['btn-default','btn-primary','btn-success','btn-info','btn-warning','btn-danger','btn-link']))attributes.addClass('btn-'+Bootstrap.checkPlain(context));if(!attributes.exists('type'))attributes.set('type',attributes.hasClass('form-submit')?'submit':'button');return '<button'+attributes+'>'+label+'</button>';},btn:function(attributes){return Drupal.theme('button',attributes);},'btn-block':function(attributes){return Drupal.theme('button',Attributes.create(attributes).addClass('btn-block'));},'btn-lg':function(attributes){return Drupal.theme('button',Attributes.create(attributes).addClass('btn-lg'));},'btn-sm':function(attributes){return Drupal.theme('button',Attributes.create(attributes).addClass('btn-sm'));},'btn-xs':function(attributes){return Drupal.theme('button',Attributes.create(attributes).addClass('btn-xs'));},bootstrapIcon:function(name,attributes){return Drupal.theme('icon','bootstrap',name,attributes);}});})(window.jQuery,window.Drupal,window.Drupal.bootstrap,window.Attributes);;
var Drupal=Drupal||{};(function($,Drupal,Bootstrap){"use strict";var $document=$(document);Bootstrap.extendPlugin('popover',function(settings){return {DEFAULTS:{animation:!!settings.popover_animation,autoClose:!!settings.popover_auto_close,enabled:settings.popover_enabled,html:!!settings.popover_html,placement:settings.popover_placement,selector:settings.popover_selector,trigger:settings.popover_trigger,title:settings.popover_title,content:settings.popover_content,delay:parseInt(settings.popover_delay,10),container:settings.popover_container}};});Drupal.behaviors.bootstrapPopovers={$activePopover:null,attach:function(context){if(!$.fn.popover||!$.fn.popover.Constructor.DEFAULTS.enabled)return;var _this=this;$document.on('show.bs.popover','[data-toggle=popover]',function(){var $trigger=$(this);var popover=$trigger.data('bs.popover');if(popover.options.originalTrigger==='click'){if(_this.$activePopover&&_this.getOption('autoClose')&&!_this.$activePopover.is($trigger))_this.$activePopover.popover('hide');_this.$activePopover=$trigger;}}).on('focus.bs.popover',':visible',function(e){var $target=$(e.target);if(_this.$activePopover&&_this.getOption('autoClose')&&!_this.$activePopover.is($target)&&!$target.closest('.popover.in')[0]){_this.$activePopover.popover('hide');_this.$activePopover=null;}}).on('click.bs.popover',function(e){var $target=$(e.target);if(_this.$activePopover&&_this.getOption('autoClose')&&!$target.is('[data-toggle=popover]')&&!$target.closest('.popover.in')[0]){_this.$activePopover.popover('hide');_this.$activePopover=null;}}).on('keyup.bs.popover',function(e){if(_this.$activePopover&&_this.getOption('autoClose')&&e.which===27){_this.$activePopover.popover('hide');_this.$activePopover=null;}});;var elements=$(context).find('[data-toggle=popover]').toArray();for(var i=0;i<elements.length;i++){var $element=$(elements[i]);var options=$.extend({},$.fn.popover.Constructor.DEFAULTS,$element.data());options.originalTrigger=options.trigger;if(options.trigger==='click')options.trigger='manual';var target=options.target||$element.is('a[href^="#"]')&&$element.attr('href');var $target=$document.find(target).clone();if(!options.content&&$target[0]){$target.removeClass('visually-hidden hidden').removeAttr('aria-hidden');options.content=$target.wrap('<div/>').parent()[options.html?'html':'text']()||'';}$element.popover(options);if(options.originalTrigger==='click'){$element.off('click.drupal.bootstrap.popover').on('click.drupal.bootstrap.popover',function(e){$(this).popover('toggle');e.preventDefault();e.stopPropagation();});;}}},detach:function(context){if(!$.fn.popover||!$.fn.popover.Constructor.DEFAULTS.enabled)return;$(context).find('[data-toggle="popover"]').off('click.drupal.bootstrap.popover').popover('destroy');;},getOption:function(name,defaultValue,element){var $element=element?$(element):this.$activePopover;var options=$.extend(true,{},$.fn.popover.Constructor.DEFAULTS,($element&&$element.data('bs.popover')||{}).options);if(options[name]!==void 0)return options[name];return defaultValue!==void 0?defaultValue:void 0;}};})(window.jQuery,window.Drupal,window.Drupal.bootstrap);;
var Drupal=Drupal||{};(function($,Drupal,Bootstrap){"use strict";Bootstrap.extendPlugin('tooltip',function(settings){return {DEFAULTS:{animation:!!settings.tooltip_animation,enabled:settings.tooltip_enabled,html:!!settings.tooltip_html,placement:settings.tooltip_placement,selector:settings.tooltip_selector,trigger:settings.tooltip_trigger,delay:parseInt(settings.tooltip_delay,10),container:settings.tooltip_container}};});Drupal.behaviors.bootstrapTooltips={attach:function(context){if(!$.fn.tooltip||!$.fn.tooltip.Constructor.DEFAULTS.enabled)return;var elements=$(context).find('[data-toggle="tooltip"]').toArray();for(var i=0;i<elements.length;i++){var $element=$(elements[i]);var options=$.extend({},$.fn.tooltip.Constructor.DEFAULTS,$element.data());$element.tooltip(options);}},detach:function(context){if(!$.fn.tooltip||!$.fn.tooltip.Constructor.DEFAULTS.enabled)return;$(context).find('[data-toggle="tooltip"]').tooltip('destroy');}};})(window.jQuery,window.Drupal,window.Drupal.bootstrap);;
(function($,Drupal,debounce){$.fn.drupalGetSummary=function(){const callback=this.data('summaryCallback');if(!this[0]||!callback)return '';const result=callback(this[0]);return result?result.trim():'';};$.fn.drupalSetSummary=function(callback){const self=this;if(typeof callback!=='function'){const val=callback;callback=function(){return val;};}return (this.data('summaryCallback',callback).off('formUpdated.summary').on('formUpdated.summary',()=>{self.trigger('summaryUpdated');}).trigger('summaryUpdated'));};Drupal.behaviors.formSingleSubmit={attach(){function onFormSubmit(e){const $form=$(e.currentTarget);const formValues=$form.serialize();const previousValues=$form.attr('data-drupal-form-submit-last');if(previousValues===formValues)e.preventDefault();else $form.attr('data-drupal-form-submit-last',formValues);}$(once('form-single-submit','body')).on('submit.singleSubmit','form:not([method~="GET"])',onFormSubmit);}};function triggerFormUpdated(element){$(element).trigger('formUpdated');}function fieldsList(form){return [].map.call(form.querySelectorAll('[name][id]'),(el)=>el.id);}Drupal.behaviors.formUpdated={attach(context){const $context=$(context);const contextIsForm=$context.is('form');const $forms=$(once('form-updated',contextIsForm?$context:$context.find('form')));let formFields;if($forms.length)$.makeArray($forms).forEach((form)=>{const events='change.formUpdated input.formUpdated ';const eventHandler=debounce((event)=>{triggerFormUpdated(event.target);},300);formFields=fieldsList(form).join(',');form.setAttribute('data-drupal-form-fields',formFields);$(form).on(events,eventHandler);});if(contextIsForm){formFields=fieldsList(context).join(',');const currentFields=$(context).attr('data-drupal-form-fields');if(formFields!==currentFields)triggerFormUpdated(context);}},detach(context,settings,trigger){const $context=$(context);const contextIsForm=$context.is('form');if(trigger==='unload')once.remove('form-updated',contextIsForm?$context:$context.find('form')).forEach((form)=>{form.removeAttribute('data-drupal-form-fields');$(form).off('.formUpdated');});}};Drupal.behaviors.fillUserInfoFromBrowser={attach(context,settings){const userInfo=['name','mail','homepage'];const $forms=$(once('user-info-from-browser','[data-user-info-from-browser]'));if($forms.length)userInfo.forEach((info)=>{const $element=$forms.find(`[name=${info}]`);const browserData=localStorage.getItem(`Drupal.visitor.${info}`);if(!$element.length)return;const emptyValue=$element[0].value==='';const defaultValue=$element.attr('data-drupal-default-value')===$element[0].value;if(browserData&&(emptyValue||defaultValue))$element.each(function(index,item){item.value=browserData;});});$forms.on('submit',()=>{userInfo.forEach((info)=>{const $element=$forms.find(`[name=${info}]`);if($element.length)localStorage.setItem(`Drupal.visitor.${info}`,$element[0].value);});});}};const handleFragmentLinkClickOrHashChange=(e)=>{let url;if(e.type==='click')url=e.currentTarget.location?e.currentTarget.location:e.currentTarget;else url=window.location;const hash=url.hash.substr(1);if(hash){const $target=$(`#${hash}`);$('body').trigger('formFragmentLinkClickOrHashChange',[$target]);setTimeout(()=>$target.trigger('focus'),300);}};const debouncedHandleFragmentLinkClickOrHashChange=debounce(handleFragmentLinkClickOrHashChange,300,true);$(window).on('hashchange.form-fragment',debouncedHandleFragmentLinkClickOrHashChange);$(document).on('click.form-fragment','a[href*="#"]',debouncedHandleFragmentLinkClickOrHashChange);})(jQuery,Drupal,Drupal.debounce);;
(function($,window,Drupal,drupalSettings,once){Drupal.behaviors.bootstrapForm={attach:function(context){if(drupalSettings.bootstrap&&drupalSettings.bootstrap.forms_has_error_value_toggle){var $context=$(context);$(once('error','.form-item.has-error:not(.form-type-password.has-feedback)',context)).each(function(){var $formItem=$(this);var $input=$formItem.find(':input');$input.on('keyup focus blur',function(){if(this.defaultValue!==void 0){$formItem[this.defaultValue!==this.value?'removeClass':'addClass']('has-error');$input[this.defaultValue!==this.value?'removeClass':'addClass']('error');}});});}}};})(jQuery,this,Drupal,drupalSettings,once);;
(function($,window,Drupal,drupalSettings,once){"use strict";var handleFragmentLinkClickOrHashChange=function handleFragmentLinkClickOrHashChange(e,$target){$target.parents('.vertical-tabs-pane').each(function(index,pane){$(pane).data('verticalTab').focus();});};Drupal.behaviors.verticalTabs={attach:function(context){var width=drupalSettings.widthBreakpoint||640;var mq='(max-width: '+width+'px)';if(window.matchMedia(mq).matches)return;$(once('vertical-tabs-fragments','body')).on('formFragmentLinkClickOrHashChange.verticalTabs',handleFragmentLinkClickOrHashChange);$(once('vertical-tabs','[data-vertical-tabs-panes]',context)).each(function(){var $this=$(this).addClass('tab-content vertical-tabs-panes');var focusID=$(':hidden.vertical-tabs__active-tab',this).val();if(typeof focusID==='undefined'||!focusID.length)focusID=false;var tab_focus;var $details=$this.find('> .panel');if($details.length===0)return;var tab_list=$('<ul class="nav nav-tabs vertical-tabs-list"></ul>');$this.wrap('<div class="tabbable tabs-left vertical-tabs clearfix"></div>').before(tab_list);$details.each(function(){var $that=$(this);var vertical_tab=new Drupal.verticalTab({title:$that.find('> .panel-heading > .panel-title, > .panel-heading').last().html(),details:$that});tab_list.append(vertical_tab.item);$that.removeClass('collapsed').attr('open',true).removeClass('collapsible collapsed panel panel-default').addClass('tab-pane vertical-tabs-pane').data('verticalTab',vertical_tab).find('> .panel-heading').remove();if(this.id===focusID)tab_focus=$that;});$(tab_list).find('> li:first').addClass('first');$(tab_list).find('> li:last').addClass('last');if(!tab_focus){var $locationHash=$this.find(window.location.hash);if(window.location.hash&&$locationHash.length)tab_focus=$locationHash.closest('.vertical-tabs-pane');else tab_focus=$this.find('> .vertical-tabs-pane:first');}if(tab_focus.length)tab_focus.data('verticalTab').focus();});$(once('bootstrap-tabs','.tabbable',context)).each(function(){var $wrapper=$(this);var $tabs=$wrapper.find('.nav-tabs');var $content=$wrapper.find('.tab-content');var borderRadius=parseInt($content.css('borderBottomRightRadius'),10);var bootstrapTabResize=function(){if($wrapper.hasClass('tabs-left')||$wrapper.hasClass('tabs-right'))$content.css('min-height',$tabs.outerHeight());};bootstrapTabResize();if($wrapper.hasClass('tabs-left')||$wrapper.hasClass('tabs-right'))$tabs.on('shown.bs.tab','a[data-toggle="tab"]',function(e){bootstrapTabResize();if($wrapper.hasClass('tabs-left'))if($(e.target).parent().is(':first-child'))$content.css('borderTopLeftRadius','0');else $content.css('borderTopLeftRadius',borderRadius+'px');else if($(e.target).parent().is(':first-child'))$content.css('borderTopRightRadius','0');else $content.css('borderTopRightRadius',borderRadius+'px');});});}};Drupal.verticalTab=function(settings){var self=this;$.extend(this,settings,Drupal.theme('verticalTab',settings));this.link.attr('href','#'+settings.details.attr('id'));this.link.on('click',function(e){e.preventDefault();self.focus();});this.link.on('keydown',function(event){if(event.keyCode===13){event.preventDefault();self.focus();$(".vertical-tabs-pane :input:visible:enabled:first").trigger('focus');}});this.details.on('summaryUpdated',function(){self.updateSummary();}).trigger('summaryUpdated');};Drupal.verticalTab.prototype={focus:function(){this.details.siblings('.vertical-tabs-pane').each(function(){$(this).removeClass('active').find('> div').removeClass('in');var tab=$(this).data('verticalTab');tab.item.removeClass('selected');}).end().addClass('active').siblings(':hidden.vertical-tabs-active-tab').val(this.details.attr('id'));this.details.find('> div').addClass('in');this.details.data('verticalTab').item.find('a').tab('show');this.item.addClass('selected');$('#active-vertical-tab').remove();this.link.append('<span id="active-vertical-tab" class="visually-hidden">'+Drupal.t('(active tab)')+'</span>');},updateSummary:function(){this.summary.html(this.details.drupalGetSummary());},tabShow:function(){this.item.show();this.item.closest('.form-type-vertical-tabs').show();this.item.parent().children('.vertical-tab-button').removeClass('first').filter(':visible:first').addClass('first');this.details.removeClass('vertical-tab-hidden').show();this.focus();return this;},tabHide:function(){this.item.hide();this.item.parent().children('.vertical-tab-button').removeClass('first').filter(':visible:first').addClass('first');this.details.addClass('vertical-tab-hidden').hide();var $firstTab=this.details.siblings('.vertical-tabs-pane:not(.vertical-tab-hidden):first');if($firstTab.length)$firstTab.data('verticalTab').focus();else this.item.closest('.form-type-vertical-tabs').hide();return this;}};Drupal.theme.verticalTab=function(settings){var tab={};tab.item=$('<li class="vertical-tab-button" tabindex="-1"></li>').append(tab.link=$('<a href="#'+settings.details[0].id+'" data-toggle="tab"></a>').append(tab.title=$('<span></span>').html(settings.title)).append(tab.summary=$('<div class="summary"></div>')));return tab;};})(jQuery,this,Drupal,drupalSettings,once);;
(($,Drupal)=>{function DetailsSummarizedContent(node){this.$node=$(node);this.setupSummary();}$.extend(DetailsSummarizedContent,{instances:[]});$.extend(DetailsSummarizedContent.prototype,{setupSummary(){this.$detailsSummarizedContentWrapper=$(Drupal.theme('detailsSummarizedContentWrapper'));this.$node.on('summaryUpdated',$.proxy(this.onSummaryUpdated,this)).trigger('summaryUpdated').find('> summary').append(this.$detailsSummarizedContentWrapper);},onSummaryUpdated(){const text=this.$node.drupalGetSummary();this.$detailsSummarizedContentWrapper.html(Drupal.theme('detailsSummarizedContentText',text));}});Drupal.behaviors.detailsSummary={attach(context){DetailsSummarizedContent.instances=DetailsSummarizedContent.instances.concat(once('details','details',context).map((details)=>new DetailsSummarizedContent(details)));}};Drupal.DetailsSummarizedContent=DetailsSummarizedContent;Drupal.theme.detailsSummarizedContentWrapper=()=>`<span class="summary"></span>`;Drupal.theme.detailsSummarizedContentText=(text)=>text?` (${text})`:'';})(jQuery,Drupal);;
(function($,Drupal){Drupal.behaviors.detailsAria={attach(){$(once('detailsAria','body')).on('click.detailsAria','summary',(event)=>{const $summary=$(event.currentTarget);const open=$(event.currentTarget.parentNode).attr('open')==='open'?'false':'true';$summary.attr({'aria-expanded':open,'aria-pressed':open});});}};})(jQuery,Drupal);;
(function($){const handleFragmentLinkClickOrHashChange=(e,$target)=>{$target.parents('details').not('[open]').find('> summary').trigger('click');};$('body').on('formFragmentLinkClickOrHashChange.details',handleFragmentLinkClickOrHashChange);})(jQuery);;
(function($,Drupal){Drupal.behaviors.entityContentDetailsSummaries={attach(context){const $context=$(context);$context.find('.entity-content-form-revision-information').drupalSetSummary((context)=>{const $revisionContext=$(context);const revisionCheckbox=$revisionContext.find('.js-form-item-revision input');if(revisionCheckbox.is(':checked')||(!revisionCheckbox.length&&$revisionContext.find('.js-form-item-revision-log textarea').length))return Drupal.t('New revision');return Drupal.t('No revision');});$context.find('details.entity-translation-options').drupalSetSummary((context)=>{const $translationContext=$(context);let translate;let $checkbox=$translationContext.find('.js-form-item-translation-translate input');if($checkbox.length)translate=$checkbox.is(':checked')?Drupal.t('Needs to be updated'):Drupal.t('Does not need to be updated');else{$checkbox=$translationContext.find('.js-form-item-translation-retranslate input');translate=$checkbox.is(':checked')?Drupal.t('Flag other translations as outdated'):Drupal.t('Do not flag other translations as outdated');}return translate;});}};})(jQuery,Drupal);;
(function($,Drupal){const states={postponed:[]};Drupal.states=states;function invert(a,invertState){return invertState&&typeof a!=='undefined'?!a:a;}function compare(a,b){if(a===b)return typeof a==='undefined'?a:true;return typeof a==='undefined'||typeof b==='undefined';}function ternary(a,b){if(typeof a==='undefined')return b;if(typeof b==='undefined')return a;return a&&b;}Drupal.behaviors.states={attach(context,settings){const $states=$(context).find('[data-drupal-states]');const il=$states.length;for(let i=0;i<il;i++){const config=JSON.parse($states[i].getAttribute('data-drupal-states'));Object.keys(config||{}).forEach((state)=>{new states.Dependent({element:$($states[i]),state:states.State.sanitize(state),constraints:config[state]});});}while(states.postponed.length)states.postponed.shift()();}};states.Dependent=function(args){$.extend(this,{values:{},oldValue:null},args);this.dependees=this.getDependees();Object.keys(this.dependees||{}).forEach((selector)=>{this.initializeDependee(selector,this.dependees[selector]);});};states.Dependent.comparisons={RegExp(reference,value){return reference.test(value);},Function(reference,value){return reference(value);},Number(reference,value){return typeof value==='string'?compare(reference.toString(),value):compare(reference,value);}};states.Dependent.prototype={initializeDependee(selector,dependeeStates){this.values[selector]={};Object.keys(dependeeStates).forEach((i)=>{let state=dependeeStates[i];if($.inArray(state,dependeeStates)===-1)return;state=states.State.sanitize(state);this.values[selector][state.name]=null;$(selector).on(`state:${state}`,{selector,state},(e)=>{this.update(e.data.selector,e.data.state,e.value);});new states.Trigger({selector,state});});},compare(reference,selector,state){const value=this.values[selector][state.name];if(reference.constructor.name in states.Dependent.comparisons)return states.Dependent.comparisons[reference.constructor.name](reference,value);return compare(reference,value);},update(selector,state,value){if(value!==this.values[selector][state.name]){this.values[selector][state.name]=value;this.reevaluate();}},reevaluate(){let value=this.verifyConstraints(this.constraints);if(value!==this.oldValue){this.oldValue=value;value=invert(value,this.state.invert);this.element.trigger({type:`state:${this.state}`,value,trigger:true});}},verifyConstraints(constraints,selector){let result;if($.isArray(constraints)){const hasXor=$.inArray('xor',constraints)===-1;const len=constraints.length;for(let i=0;i<len;i++)if(constraints[i]!=='xor'){const constraint=this.checkConstraints(constraints[i],selector,i);if(constraint&&(hasXor||result))return hasXor;result=result||constraint;}}else{if($.isPlainObject(constraints)){for(const n in constraints)if(constraints.hasOwnProperty(n)){result=ternary(result,this.checkConstraints(constraints[n],selector,n));if(result===false)return false;}}}return result;},checkConstraints(value,selector,state){if(typeof state!=='string'||/[0-9]/.test(state[0]))state=null;else{if(typeof selector==='undefined'){selector=state;state=null;}}if(state!==null){state=states.State.sanitize(state);return invert(this.compare(value,selector,state),state.invert);}return this.verifyConstraints(value,selector);},getDependees(){const cache={};const _compare=this.compare;this.compare=function(reference,selector,state){(cache[selector]||(cache[selector]=[])).push(state.name);};this.verifyConstraints(this.constraints);this.compare=_compare;return cache;}};states.Trigger=function(args){$.extend(this,args);if(this.state in states.Trigger.states){this.element=$(this.selector);if(!this.element.data(`trigger:${this.state}`))this.initialize();}};states.Trigger.prototype={initialize(){const trigger=states.Trigger.states[this.state];if(typeof trigger==='function')trigger.call(window,this.element);else Object.keys(trigger||{}).forEach((event)=>{this.defaultTrigger(event,trigger[event]);});this.element.data(`trigger:${this.state}`,true);},defaultTrigger(event,valueFn){let oldValue=valueFn.call(this.element);this.element.on(event,$.proxy(function(e){const value=valueFn.call(this.element,e);if(oldValue!==value){this.element.trigger({type:`state:${this.state}`,value,oldValue});oldValue=value;}},this));states.postponed.push($.proxy(function(){this.element.trigger({type:`state:${this.state}`,value:oldValue,oldValue:null});},this));}};states.Trigger.states={empty:{keyup(){return this.val()==='';},change(){return this.val()==='';}},checked:{change(){let checked=false;this.each(function(){checked=$(this).prop('checked');return !checked;});return checked;}},value:{keyup(){if(this.length>1)return this.filter(':checked').val()||false;return this.val();},change(){if(this.length>1)return this.filter(':checked').val()||false;return this.val();}},collapsed:{collapsed(e){return typeof e!=='undefined'&&'value' in e?e.value:!this.is('[open]');}}};states.State=function(state){this.pristine=state;this.name=state;let process=true;do{while(this.name.charAt(0)==='!'){this.name=this.name.substring(1);this.invert=!this.invert;}if(this.name in states.State.aliases)this.name=states.State.aliases[this.name];else process=false;}while(process);};states.State.sanitize=function(state){if(state instanceof states.State)return state;return new states.State(state);};states.State.aliases={enabled:'!disabled',invisible:'!visible',invalid:'!valid',untouched:'!touched',optional:'!required',filled:'!empty',unchecked:'!checked',irrelevant:'!relevant',expanded:'!collapsed',open:'!collapsed',closed:'collapsed',readwrite:'!readonly'};states.State.prototype={invert:false,toString(){return this.name;}};const $document=$(document);$document.on('state:disabled',(e)=>{if(e.trigger)$(e.target).closest('.js-form-item, .js-form-submit, .js-form-wrapper').toggleClass('form-disabled',e.value).find('select, input, textarea').prop('disabled',e.value);});$document.on('state:readonly',(e)=>{if(e.trigger)$(e.target).closest('.js-form-item, .js-form-submit, .js-form-wrapper').toggleClass('form-readonly',e.value).find('input, textarea').prop('readonly',e.value);});$document.on('state:required',(e)=>{if(e.trigger)if(e.value){const label=`label${e.target.id?`[for=${e.target.id}]`:''}`;const $label=$(e.target).attr({required:'required','aria-required':'true'}).closest('.js-form-item, .js-form-wrapper').find(label);if(!$label.hasClass('js-form-required').length)$label.addClass('js-form-required form-required');}else $(e.target).removeAttr('required aria-required').closest('.js-form-item, .js-form-wrapper').find('label.js-form-required').removeClass('js-form-required form-required');});$document.on('state:visible',(e)=>{if(e.trigger)$(e.target).closest('.js-form-item, .js-form-submit, .js-form-wrapper').toggle(e.value);});$document.on('state:checked',(e)=>{if(e.trigger)$(e.target).closest('.js-form-item, .js-form-wrapper').find('input').prop('checked',e.value).trigger('change');});$document.on('state:collapsed',(e)=>{if(e.trigger)if($(e.target).is('[open]')===e.value)$(e.target).find('> summary').trigger('click');});})(jQuery,Drupal);;
(function($){$(document).unbind('state:disabled');$(document).bind('state:disabled',function(e){if(e.trigger)$(e.target).attr('disabled',e.value).closest('.form-item, .form-submit, .form-wrapper').toggleClass('form-disabled',e.value).find(':input').attr('disabled',e.value);});})(jQuery);;
(function($,once){'use strict';function updateFilterHelpLink(){var $link=$(this).parents('.filter-wrapper').find('.filter-help > a');var originalLink=$link.data('originalLink');if(!originalLink){originalLink=$link.attr('href');$link.data('originalLink',originalLink);}$link.attr('href',originalLink+'/'+$(this).find(':selected').val());}$(document).on('change','.filter-wrapper select.filter-list',updateFilterHelpLink);Drupal.behaviors.filterGuidelines={attach:function(context){$(once('filter-list','.filter-wrapper select.filter-list',context)).each(updateFilterHelpLink);}};})(jQuery,once);;