(function ($, ej, undefined) {
	"use strict";
    ej.RTE = ej.RTE || {};
    ej.RTE.FindAndReplace = {
	_findObject:null,
	_selectedIndex:-1,
	_findAndReplaceClick:function (args){
		var dialog=this._findDialog.element,text=$.trim($(dialog).find("[ej-function='findtxt']").val()),targetElement=(args.target.tagName=="SPAN"||args.target.tagName=="DIV")?$(args.target).closest("button")[0]:args.target,replacetxt=$(dialog).find("[ej-function='replacetxt']").val(),target=this.getDocument().body,findElement=$(dialog).find("[ej-function='replace'],[ej-function='replaceAll']"),navElement=$(dialog).find("[ej-function='prev'],[ej-function='next']");
		$(this._findDialog.element).children('span').html('');
		if(!$(targetElement).hasClass("e-disable"))
		switch(targetElement.getAttribute('ej-function'))
		{
			case "find":
			if(text){			
				this._findObject.find(text,target,!$(dialog).find("[ej-function='matchCase']")[0].checked,$(dialog).find("[ej-function='wholeWords']")[0].checked),this._selectedIndex=-1;
				if(this._findObject.nodeCollection.length){
					$('#'+ this._id + '_rtefindcount').html('');
					(this._findObject.nodeCollection.length>0)?findElement.ejButton("enable"):findElement.ejButton("disable");
					this._highlightNode(++this._selectedIndex,target);
					this._updateBtnStatus(this._selectedIndex,navElement);
				}
				else{
					$.merge(navElement,findElement).ejButton("disable");					
					this._findObject.revertAll();
					$(this._findDialog.element).children('span').html(this._getLocalizedLabels("FindErrorMsg"));
				}
			}
			else if(this._findObject.nodeCollection.length)
			this._findObject.revertAll();
			break;
			case "next":
			if(this._selectedIndex<this._findObject.nodeCollection.length){
				$('#'+ this._id + '_rtefindcount').html('');
			this._highlightNode(++this._selectedIndex,target);
			}
			this._updateBtnStatus(this._selectedIndex,navElement);
			break
			case "prev":
			if(this._selectedIndex>0){
				$('#'+ this._id + '_rtefindcount').html('');
				this._highlightNode(--this._selectedIndex,target);
				}
			this._updateBtnStatus(this._selectedIndex,navElement);
			break;
			case "replace":
					this._findObject.replaceByIndex(this._selectedIndex,replacetxt);
					if(!this._findObject.nodeCollection.length){
						$('#'+ this._id + '_rtefindcount').html('');	
						this._selectedIndex=-1;
					}
					else if (this._selectedIndex>this._findObject.nodeCollection.length-1) --this._selectedIndex;
					
					if(this._selectedIndex>-1){
						$('#'+ this._id + '_rtefindcount').html('');
						this._highlightNode(this._selectedIndex,target);
						this._updateBtnStatus(this._selectedIndex,navElement); 
					}
					else
						$.merge(navElement,findElement).ejButton("disable");
					this._setBackupData(); 
			break;
			case "replaceAll":
					var _replaceCount = this._findObject.replaceAll(replacetxt);this._selectedIndex=-1;
					$('#'+ this._id +'_rteReplaceCount').append(_replaceCount +this._getLocalizedLabels("ReplaceCount") );
					$.merge(navElement,findElement).ejButton("disable");					
					this._setBackupData(); 
			break;		
		}
		this._updateCount();        
	
	}, 
	_updateBtnStatus:function(_selectedIndex,element){
		(_selectedIndex<this._findObject.nodeCollection.length-1)?$(element[1]).ejButton("enable"):$(element[1]).ejButton("disable");
		(_selectedIndex>0)?$(element[0]).ejButton("enable"):$(element[0]).ejButton("disable");
	},
	_highlightNode:function(nodeIndex,target){
		$(target).find(".e-highlight").removeClass("e-highlight");
		for (var index=0;index<this._findObject.nodeCollection.length;index++){
			if(nodeIndex==index)
				for (var index1=0;index1<this._findObject.nodeCollection[index].length;index1++){
					$(this._findObject.nodeCollection[index][index1].node).addClass("e-highlight");
					$((ej.browserInfo().name=="msie"||ej.browserInfo().name=="mozilla")?target.parentElement:target).scrollTop($(this._findObject.nodeCollection[index][index1].node).offset().top - 25);
				}
				
		}
		$('#'+ this._id + '_rtefindcount').append(nodeIndex+ this._getLocalizedLabels("FindOf") + this._findObject.nodeCollection.length);		 
	},	

	_renderFindDialog:function (target){
		
	    var content = "<div id='" + this._id + "_basicDialog' title='" + this._getLocalizedLabels("FindAndReplace") + "'><div class='e-maincontent'><div class='e-fd-findcontent'><div class='e-fd-lable'><span>" + this._getLocalizedLabels("Find") + "</span></div><div class='e-txtbox'><input type='text' ej-function='findtxt' id='" + this._id + "_findtxt' class='e-js e-input'></div><div id='" + this._id + "_rtefindcount' class='e-rtefindcount'></div></div><div class='e-fd-InnerContent'><div><input type='checkbox' ej-function='matchCase' id='" + this._id + "_matchCase' value='true'><label for='" + this._id + "_matchCase' class='e-fd-checkboxlable' style=''>" + this._getLocalizedLabels("MatchCase") + "</label></div><div class='e-checkbx'><input type='checkbox' ej-function='wholeWords' id='" + this._id + "_wholeWords' value='true'><label for='" + this._id + "_wholeWords' class='e-fd-checkboxlable'>" + this._getLocalizedLabels("WholeWord") + "</label></div></div><div class='e-fd-replacecontent'><div class='e-fd-lable'><span>" + this._getLocalizedLabels("ReplaceWith") + "</span></div><div class='e-txtbox'><input type='text' ej-function='replacetxt' id='" + this._id + "_replacetxt' class='e-js e-input'></div></div></div><div id='" + this._id + "_rteReplaceCount' class='e-rteReplaceCount'></div><span style='text-align: center;'></span><div class='e-fd-btncol'><div class='e-btn-left'><button id='" + this._id + "_find' ej-function='find'>" + this._getLocalizedLabels("Find") + "</button><button id='" + this._id + "_replace' ej-function='replace'>" + this._getLocalizedLabels("Replace") + "</button><button id='" + this._id + "_replaceAll' class='ejRTE-replaceAll' ej-function='replaceAll'>" + this._getLocalizedLabels("ReplaceAll") + "</button></div><div class='e-btn-right'><button id='" + this._id + "_prev' ej-function='prev'></button><button id='" + this._id + "_next' ej-function='next'></button></div></div></div>";
		target._findDialog=$(content).ejDialog({
                width: "auto",
				minWidth:"300px",
				maxWidth:"380px",
				isResponsive:true,
                close:this._onCloseFindAndReplace,cssClass:"e-rte e-findandreplace",enableRTL:target.model.enableRTL,enableResize: false,enableModal: true				
            }).data("ejDialog");
			$(target._findDialog.element).find("input[type=text]").val("");
			$(target._findDialog.element).find("button").ejButton({height: 30});
			$(target._findDialog.element).find("[ej-function='replace'],[ej-function='replaceAll'],[ej-function='prev'],[ej-function='next']").ejButton("disable");
			$(target._findDialog.element).find("[ej-function='prev'],[ej-function='next']").ejButton({height: 30, width: 30,contentType: "imageonly"});
			$(target._findDialog.element).find("[ej-function='prev']").ejButton({ prefixIcon:"e-icon e-chevron-left_02"}).next().ejButton({ prefixIcon: "e-icon e-chevron-right_02"});
			$(target._findDialog.element).find("[ej-function='wholeWords'],[ej-function='matchCase']").ejCheckBox({enableRTL:target.model.enableRTL,checked:  false});				
			this._findObject=new ej.FindAndReplace()
			this._on(target._findDialog.element.find("button"), "click", this._findAndReplaceClick);
	},
	_onCloseFindAndReplace:function(args){
					$("#"+this._id.replace("_basicDialog","")).data("ejRTE")._findObject.revertAll();
					this.element.find("[ej-function='replace'],[ej-function='replaceAll'],[ej-function='prev'],[ej-function='next']").ejButton("disable");
					this.element.find("input[type=text]").val("");
					this.element.find("[ej-function='wholeWords'],[ej-function='matchCase']").ejCheckBox({checked:false});
					this.element.children('span').html('');
					$('.e-rteReplaceCount').html('');
					$('.e-rtefindcount').html('');
	},
	_showFindAndReplace:function (){
		this._findDialog?this._findDialog.open():this._renderFindDialog(this);
	}
	
	}
	
})(jQuery, Syncfusion);

(function() {

  ej.FindAndReplace = function() {
    this.indexLength=0,this.elements=[],this.matches=[],this.nodeCollection=[];
	this.specialChar=/([{}()|[\]\/\\.*+?^=!:$])/g,this.escapeContent='\\$1';
  }
  ej.FindAndReplace.prototype._addContentEscape=function(content){
	return String(content).replace(this.specialChar, this.escapeContent);
  }

  ej.FindAndReplace.prototype.find=function(text,node,igncase,wholeword){
	if(this.nodeCollection.length)
		this.revertAll();
	this._validateTextContent(text,this._getFormatedText(node,wholeword),igncase,wholeword);
	if(this.matches.length)
	{
		this._iterateNodes(node),this.matches=[];
		return true;
	}
	else
		return false;
  }
  ej.FindAndReplace.prototype._replace=function(collection,text){
	for(var index1=0;index1<collection.length;index1++) 
		(!index1||!text)?this._elementDefragment(collection[index1].node,text):$(collection[index1].node).remove();	
}
  ej.FindAndReplace.prototype.replaceByIndex=function(Index,text){
	var tempNodes=[]
	for(var index=0;index<this.nodeCollection.length;index++) 
		(index==Index)?	this._replace(this.nodeCollection[index],text):tempNodes.push(this.nodeCollection[index]);	
	this.nodeCollection=tempNodes;
}
  ej.FindAndReplace.prototype.replaceAll=function(text){
	for(var index=0;index<this.nodeCollection.length;index++) 
		this._replace(this.nodeCollection[index],text);	
	this.nodeCollection=[];
	return index;
}

  ej.FindAndReplace.prototype.revertAll=function(){
	for(var index=0;index<this.nodeCollection.length;index++) 
	this._replace(this.nodeCollection[index]);
	this.nodeCollection=[];
}
  
 ej.FindAndReplace.prototype._elementDefragment=function (node,text){
var tempNode=node.nextSibling,tempNode1=node.previousSibling;

if(tempNode&&tempNode1&&tempNode.nodeType==3 && tempNode1.nodeType==3)
{
	tempNode=node.previousSibling;
	tempNode.data=tempNode.data+(text!= undefined ? text:node.firstChild.data)+node.nextSibling.data;	
	$(node.nextSibling).remove();
	$(node).remove();
}
else if(tempNode&&tempNode.nodeType==3)
{	
	tempNode=node.nextSibling;
	tempNode.data=(text!= undefined ? text:node.firstChild.data)+tempNode.data;
	$(node).remove();
}
else if(tempNode1&&tempNode1.nodeType==3)
{
	tempNode=node.previousSibling;
	tempNode.data=tempNode.data+(text!= undefined ? text:node.firstChild.data);
	$(node).remove();
}
else 
{
	tempNode=(text!= undefined) ? document.createTextNode(text):node.firstChild;
	$(node).replaceWith(tempNode);
}
}

  ej.FindAndReplace.prototype._validateTextContent=function(text,content,igncase,wholeword){
	var temp = content;
	var content = wholeword ? content.split("\n").join('') : content;
 	var target=this._addContentEscape(text),regx=new RegExp(wholeword ? "\\b"+target+"\\b":target,igncase?'gi':'g');
	while(data=regx.exec(content))
		this.matches.push({startIndex:data.index,endIndex:data.index+text.length});
	if(this.matches.length == 0 && wholeword){
	    var indices = []; 
		for(var i=0; i<temp.length;i++) {
			if (temp[i] === "\n") indices.push(i);
		}
	    content = wholeword ? temp.replace(/\n/g,' ') : temp;
		var target=this._addContentEscape(text),regx=new RegExp(wholeword ? "\\b"+target+"\\b":target,igncase?'gi':'g');
		while(data=regx.exec(content)){
			var count = 0, si = data.index, ei = data.index+text.length;
			for(var i = 0; i< indices.length;i++){
				if(indices[i] <= si) count++;
			}
			this.matches.push({startIndex: si - count,endIndex: ei - count });
		}
	}
	return this.matches;
}

 ej.FindAndReplace.prototype._traverseNode=function(element,data){

	if (element.nodeType === 3)	
	{	
		out=this._validateData(element,data);
		if(out.curNode) element=out.curNode;
			if(out.status)
			return true;
	}
	
	if(element=element.firstChild)
	do
	{	  
		if(element.nodeType === 3)
		{
			out=this._validateData(element,data);
			if(out.curNode) element=out.curNode;
			if(out.status)
				return true;
		}
		else 		
		{		
			if(this._traverseNode(element,data))
				return true;
		}
	}while(element=element.nextSibling)
	
	return false;
}

 ej.FindAndReplace.prototype._validateData=function(curNode,data){
	var startIndex=this.indexLength,endIndex=this.indexLength+curNode.length;this.indexLength=this.indexLength+curNode.length;	
	if(startIndex>=data.startIndex||data.startIndex<endIndex)
		return this._elementFragment(data,{startIndex:startIndex,endIndex:endIndex},curNode);
	else 
		return {status:false};

}

 ej.FindAndReplace.prototype._elementFragment=function(cIndex,eIndex,element){
	var tempdata=element.data,finalNode=element;
	if((cIndex.startIndex<=eIndex.startIndex)&&(cIndex.endIndex>=eIndex.endIndex))//full Element Replacement
	{
		finalNode=ej.buildTag("span.e-selected-node").append(document.createTextNode(element.data))[0];
		$(element).replaceWith(finalNode);
		this.elements.push({node:finalNode});
	}
	else if((cIndex.startIndex<=eIndex.startIndex)&&(cIndex.endIndex<eIndex.endIndex))
	{
		var tempindex=(cIndex.endIndex-cIndex.startIndex),dataNode=ej.buildTag("span.e-selected-node").append(document.createTextNode(tempdata.substr(0,tempindex)))[0];
		$(dataNode).insertBefore(element);
		element.data=tempdata.substr(tempindex);
		this.elements.push({node:dataNode});
	}	
	else if((cIndex.startIndex>eIndex.startIndex)&&(cIndex.endIndex>=eIndex.endIndex))
	{
		
		tempindex=(cIndex.startIndex-eIndex.startIndex),finalNode=ej.buildTag("span.e-selected-node").append(document.createTextNode(tempdata.substr(tempindex)))[0];
		$(finalNode).insertAfter(element);
		element.data=tempdata.substr(0,tempindex);
		this.elements.push({node:finalNode});
	}
	else if((cIndex.startIndex>eIndex.startIndex)&&(cIndex.endIndex<eIndex.endIndex))
	{
		var tempstart=(cIndex.startIndex-eIndex.startIndex),tempend=tempstart+(cIndex.endIndex-cIndex.startIndex),dataNode=ej.buildTag("span.e-selected-node").append(document.createTextNode(tempdata.substring(tempstart,tempend)))[0];finalNode=document.createTextNode(tempdata.substring(tempend));		
		element.data=tempdata.substr(0,tempstart);
		$(finalNode).insertAfter(element);
		$(dataNode).insertAfter(element);		
		this.elements.push({node:dataNode});
	}
	return {status:cIndex.endIndex>eIndex.startIndex && cIndex.endIndex<=eIndex.endIndex,curNode:finalNode};
}

 ej.FindAndReplace.prototype._getFormatedText=function (element,wholeword){
	var text='';
	if (element.nodeType === 3) return element.data.replace(/\n/g,' ');
	
	if(element=element.firstChild)
	do
	{	  
		text+= (element.nodeType === 3)? (element.data.replace(/\n/g,' ') + (wholeword ? "\n": "") ):this._getFormatedText(element,wholeword);		
	}while(element=element.nextSibling)
	
	return text;
				
}

 ej.FindAndReplace.prototype._iterateNodes=function (curNode){
	temp=this;
	$(this.matches).each(function(index,data)
	{
		temp._traverseNode(curNode,data),temp.nodeCollection.push(temp.elements),temp.indexLength=0,temp.elements=[];		
	});
}
}());


if(ej.RTE.FindAndReplace)
 $.extend(ej.RTE.prototype, ej.RTE.FindAndReplace);