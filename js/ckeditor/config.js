/**
 * @license Copyright (c) 2003-2017, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or http://ckeditor.com/license
 */

            CKEDITOR.editorConfig = function( config ) {
	config.toolbarGroups = [
        { name: 'clipboard', groups: [ 'clipboard', 'undo' ] },
        { name: 'editing', groups: [ 'find', 'selection', 'spellchecker', 'editing' ] },
        { name: 'links', groups: [ 'links' ] },
        { name: 'insert', groups: [ 'insert' ] },
        { name: 'document', groups: [ 'mode', 'document', 'doctools' ] },
        { name: 'basicstyles', groups: [ 'basicstyles', 'cleanup' ] },
        { name: 'paragraph', groups: [ 'list', 'indent', 'blocks', 'align', 'bidi', 'paragraph' ] },
        { name: 'styles', groups: [ 'styles' ] }
	];

	config.removeButtons = 'Font,Language,BidiLtr,BidiRtl,JustifyBlock,JustifyLeft,JustifyCenter,JustifyRight,CreateDiv,RemoveFormat,CopyFormatting,Templates,Print,Preview,NewPage,PageBreak,Anchor,Iframe,Smiley,Flash,Find,Replace,SelectAll,Underline,Subscript,Superscript,Image,Blockquote,Outdent,Table,SpecialChar,HorizontalRule,Source,Strike,Indent,Maximize,About';
};
    