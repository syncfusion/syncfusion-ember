/**
* @fileOverview Plugin to style the Html Button elements
* @copyright Copyright Syncfusion Inc. 2001 - 2014. All rights reserved.
*  Use of this code is subject to the terms of our license.
*  A copy of the current license can be obtained at any time by e-mailing
*  licensing@syncfusion.com. Any infringement will be prosecuted under
*  applicable laws. 
* @version 12.1 
* @author <a href="mailto:licensing@syncfusion.com">Syncfusion Inc</a>
*/


(function ($, ej, undefined) {

    var initialDigitalDivWidth, _digitalGaugeCount, initialGaugeCount;
    ej.widget({ "ejDigitalGauge": "ej.datavisualization.DigitalGauge" }, {
     
        element: null,
     
        model: null,
        validTags: ["div", "span"],
        _rootCSS: "e-digitalgauge",
        
        defaults:   {
              
            exportSettings:{
                mode: 'client',
                type: 'png',
                fileName: 'DigitalGauge',
                action: ''
            },

            segmentData: {
                "0": [0, 1, 2, 3, 4, 5, 14, 15], "1": [1, 2], "2": [0, 14, 1, 6, 8, 4, 3, 15], "3": [0, 1, 2, 3, 6, 8, 14, 15], "4": [1, 2, 5, 6, 8], "5": [0, 2, 3, 5, 6, 8, 14, 15], "6": [0, 2, 3, 4, 5, 6, 8, 14, 15],
                "7": [0, 1, 2, 14], "8": [0, 1, 2, 3, 4, 5, 6, 8, 14, 15], "9": [0, 1, 2, 3, 5, 6, 8, 14, 15], "A": [0, 1, 2, 4, 5, 6, 8, 14], "B": [0, 1, 2, 3, 7, 9, 8, 14, 15], "C": [0, 3, 4, 5, 14, 15],
                "D": [0, 1, 2, 3, 7, 9, 14, 15], "E": [0, 3, 4, 5, 6, 8, 14, 15], "F": [0, 4, 5, 6, 8, 14], "G": [0, 2, 3, 4, 5, 8, 14, 15], "H": [1, 2, 4, 5, 6, 8], "I": [0, 3, 7, 9, 14, 15],
                "J": [1, 2, 3, 4, 15], "K": [4, 5, 6, 10, 11], "L": [3, 4, 5, 15], "M": [1, 2, 4, 5, 10, 13], "N": [1, 2, 4, 5, 11, 13], "O": [0, 1, 2, 3, 4, 5, 14, 15], "P": [0, 1, 4, 5, 6, 8, 14],
                "Q": [0, 1, 2, 3, 4, 5, 11, 14, 15], "R": [0, 1, 4, 5, 6, 8, 11, 14], "S": [0, 2, 3, 5, 6, 8, 14, 15], "T": [0, 7, 9, 14], "U": [1, 2, 3, 4, 5, 15], "V": [4, 5, 10, 12], "W": [1, 2, 4, 5, 11, 12],
                "X": [10, 11, 12, 13], "Y": [1, 5, 6, 7, 8], "Z": [0, 3, 10, 12, 14, 15]
            },
              
            matrixSegmentData: {
                "1": [0, 3, 0, 4, 1, 1, 1, 2, 1, 3, 1, 4, 2, 3, 2, 4, 3, 3, 3, 4, 4, 3, 4, 4, 5, 3, 5, 4, 6, 1, 6, 2, 6, 3, 6, 4, 6, 5, 6, 6],
                "2": [0, 1, 0, 2, 0, 3, 0, 4, 0, 5, 1, 5, 1, 6, 2, 5, 2, 6, 3, 4, 3, 5, 4, 3, 4, 2, 5, 2, 5, 1, 6, 1, 6, 2, 6, 3, 6, 4, 6, 5, 6, 6],
                "3": [0, 1, 0, 2, 0, 3, 0, 4, 0, 5, 1, 5, 1, 6, 2, 5, 2, 6, 3, 2, 3, 3, 3, 4, 3, 5, 3, 6, 4, 5, 4, 6, 5, 5, 5, 6, 6, 1, 6, 2, 6, 3, 6, 4, 6, 5],
                "4": [0, 3, 0, 4, 0, 5, 1, 2, 1, 3, 1, 4, 1, 5, 2, 1, 2, 2, 2, 4, 2, 5, 3, 0, 3, 1, 3, 4, 3, 5, 4, 0, 4, 1, 4, 2, 4, 3, 4, 4, 4, 5, 4, 6, 5, 4, 5, 5, 6, 4, 6, 5],
                "5": [0, 1, 0, 2, 0, 3, 0, 4, 0, 5, 0, 6, 1, 1, 1, 2, 2, 1, 2, 2, 3, 1, 3, 2, 3, 3, 3, 4, 3, 5, 3, 6, 4, 5, 4, 6, 5, 5, 5, 6, 6, 1, 6, 2, 6, 3, 6, 4, 6, 5, 6, 6],
                "6": [0, 3, 0, 4, 0, 5, 0, 6, 1, 2, 1, 3, 2, 1, 2, 2, 3, 1, 3, 2, 3, 3, 3, 4, 3, 5, 3, 6, 4, 1, 4, 2, 4, 3, 4, 6, 4, 7, 5, 2, 5, 3, 5, 6, 5, 7, 6, 3, 6, 4, 6, 5, 6, 6],
                "7": [0, 1, 0, 2, 0, 3, 0, 4, 0, 5, 0, 6, 0, 7, 1, 6, 1, 7, 2, 5, 2, 6, 3, 4, 3, 5, 4, 3, 4, 4, 5, 2, 5, 3, 6, 1, 6, 2],
                "8": [0, 2, 0, 3, 0, 4, 0, 5, 0, 6, 1, 1, 1, 2, 1, 6, 1, 7, 2, 1, 2, 2, 2, 6, 2, 7, 3, 2, 3, 3, 3, 4, 3, 5, 3, 6, 4, 1, 4, 2, 4, 6, 4, 7, 5, 1, 5, 2, 5, 6, 5, 7, 6, 2, 6, 3, 6, 4, 6, 5, 6, 6],
                "9": [0, 2, 0, 3, 0, 4, 0, 5, 1, 1, 1, 2, 1, 5, 1, 6, 2, 1, 2, 2, 2, 4, 2, 5, 2, 6, 3, 2, 3, 3, 3, 4, 3, 5, 3, 6, 4, 5, 4, 6, 5, 5, 5, 6, 6, 2, 6, 3, 6, 4, 6, 4, 6, 5],
                "0": [0, 2, 0, 3, 0, 4, 0, 5, 0, 6, 1, 1, 1, 2, 1, 6, 1, 7, 2, 1, 2, 2, 2, 6, 2, 7, 3, 1, 3, 2, 3, 6, 3, 7, 4, 1, 4, 2, 4, 6, 4, 7, 5, 1, 5, 2, 5, 6, 5, 7, 6, 2, 6, 3, 6, 4, 6, 5, 6, 6],
                "a": [0, 2, 0, 3, 0, 4, 0, 5, 0, 6, 1, 6, 1, 7, 2, 6, 2, 7, 3, 2, 3, 3, 3, 4, 3, 5, 3, 6, 3, 7, 4, 1, 4, 2, 4, 6, 4, 7, 5, 1, 5, 2, 5, 6, 5, 7, 6, 2, 6, 3, 6, 4, 6, 5, 6, 6, 6, 7],
                "b": [0, 1, 0, 2, 1, 1, 1, 2, 2, 1, 2, 2, 3, 1, 3, 2, 3, 3, 3, 4, 3, 5, 3, 6, 4, 1, 4, 2, 4, 3, 4, 6, 4, 7, 5, 1, 5, 2, 5, 6, 5, 7, 6, 1, 6, 2, 6, 3, 6, 4, 6, 5, 6, 6],
                "c": [1, 3, 1, 4, 1, 5, 1, 6, 2, 2, 2, 3, 3, 1, 3, 2, 4, 1, 4, 2, 5, 2, 5, 3, 6, 3, 6, 4, 6, 5, 6, 6],
                "d": [0, 6, 0, 7, 1, 6, 1, 7, 2, 6, 2, 7, 3, 2, 3, 3, 3, 4, 3, 5, 3, 6, 3, 7, 4, 1, 4, 2, 4, 5, 4, 6, 4, 7, 5, 1, 5, 2, 5, 6, 5, 7, 6, 2, 6, 3, 6, 4, 6, 5, 6, 6, 6, 7],
                "e": [0, 2, 0, 3, 0, 4, 0, 5, 0, 6, 1, 1, 1, 2, 1, 6, 1, 7, 2, 1, 2, 2, 2, 6, 2, 7, 3, 1, 3, 2, 3, 3, 3, 4, 3, 5, 3, 6, 4, 1, 4, 2, 5, 1, 5, 2, 6, 2, 6, 3, 6, 4, 6, 5, 6, 6, 6, 7],
                "f": [0, 4, 0, 5, 0, 6, 0, 7, 1, 3, 1, 4, 2, 3, 2, 4, 3, 1, 3, 2, 3, 3, 3, 4, 3, 5, 3, 6, 3, 7, 4, 3, 4, 4, 5, 3, 5, 4, 6, 3, 6, 4],
                "g": [0, 2, 0, 3, 0, 4, 0, 5, 0, 6, 0, 7, 1, 1, 1, 2, 1, 6, 1, 7, 2, 1, 2, 2, 2, 6, 2, 7, 3, 2, 3, 3, 3, 4, 3, 5, 3, 6, 3, 7, 4, 6, 4, 7, 5, 6, 5, 7, 6, 2, 6, 3, 6, 4, 6, 5, 6, 6],
                "h": [0, 1, 0, 2, 1, 1, 1, 2, 2, 1, 2, 2, 3, 1, 3, 2, 3, 3, 3, 4, 3, 5, 3, 6, 4, 1, 4, 2, 4, 3, 4, 6, 4, 7, 5, 1, 5, 2, 5, 6, 5, 7, 6, 1, 6, 2, 6, 6, 6, 7],
                "i": [0, 3, 0, 4, 2, 1, 2, 2, 2, 3, 2, 4, 3, 3, 3, 4, 4, 3, 4, 4, 5, 3, 5, 4, 6, 3, 6, 4],
                "j": [1, 5, 1, 6, 2, 5, 2, 6, 3, 5, 3, 6, 4, 1, 4, 2, 4, 5, 4, 6, 5, 1, 5, 2, 5, 5, 5, 6, 6, 2, 6, 3, 6, 4, 6, 5],
                "k": [0, 1, 0, 2, 1, 1, 1, 2, 1, 4, 1, 5, 2, 1, 2, 2, 2, 3, 2, 4, 3, 1, 3, 2, 3, 3, 4, 1, 4, 2, 4, 3, 4, 4, 4, 5, 5, 1, 5, 2, 5, 5, 5, 6, 6, 1, 6, 2, 6, 6, 6, 7],
                "l": [0, 2, 0, 3, 0, 4, 0, 5, 0, 6, 1, 5, 1, 6, 2, 5, 2, 6, 3, 5, 3, 6, 4, 5, 4, 6, 5, 5, 5, 6, 6, 5, 6, 6],
                "m": [0, 1, 0, 2, 0, 3, 0, 4, 0, 5, 0, 6, 1, 0, 1, 1, 1, 2, 1, 3, 1, 4, 1, 5, 1, 6, 1, 7, 2, 0, 2, 1, 2, 3, 2, 4, 2, 6, 2, 7, 3, 0, 3, 1, 3, 3, 3, 4, 3, 6, 3, 7, 4, 0, 4, 1, 4, 3, 4, 4, 4, 6, 4, 7, 5, 0, 5, 1, 5, 3, 5, 4, 5, 6, 5, 7, 6, 0, 6, 1, 6, 3, 6, 4, 6, 6, 6, 7],
                "n": [1, 1, 1, 2, 1, 3, 1, 4, 1, 5, 1, 6, 2, 0, 2, 1, 2, 2, 2, 6, 2, 7, 3, 0, 3, 1, 3, 6, 3, 7, 4, 0, 4, 1, 4, 6, 4, 7, 5, 0, 5, 1, 5, 6, 5, 7, 6, 0, 6, 1, 6, 6, 6, 7],
                "o": [1, 2, 1, 3, 1, 4, 1, 5, 2, 1, 2, 2, 2, 5, 2, 6, 3, 1, 3, 2, 3, 5, 3, 6, 4, 1, 4, 2, 4, 5, 4, 6, 5, 1, 5, 2, 5, 5, 5, 6, 6, 2, 6, 3, 6, 4, 6, 5],
                "p": [1, 1, 1, 2, 1, 3, 1, 4, 1, 5, 1, 6, 2, 1, 2, 2, 2, 3, 2, 6, 2, 7, 3, 1, 3, 2, 3, 6, 3, 7, 4, 1, 4, 2, 4, 3, 4, 4, 4, 5, 4, 6, 5, 1, 5, 2, 6, 1, 6, 2],
                "q": [0, 2, 0, 3, 0, 4, 0, 5, 0, 6, 0, 7, 1, 1, 1, 2, 1, 5, 1, 6, 1, 7, 2, 1, 2, 2, 2, 6, 2, 7, 3, 1, 3, 2, 3, 5, 3, 6, 3, 7, 4, 2, 4, 3, 4, 4, 4, 5, 4, 6, 4, 7, 5, 6, 5, 7, 6, 6, 6, 7],
                "r": [0, 1, 0, 3, 0, 4, 0, 5, 1, 1, 1, 2, 1, 3, 1, 4, 1, 5, 1, 6, 2, 1, 2, 2, 2, 6, 3, 1, 3, 2, 4, 1, 4, 2, 5, 1, 5, 2, 6, 1, 6, 2],
                "s": [1, 2, 1, 3, 1, 4, 1, 5, 2, 1, 2, 2, 3, 1, 3, 2, 4, 3, 4, 4, 5, 4, 5, 5, 6, 1, 6, 2, 6, 3, 6, 4],
                "t": [0, 3, 0, 4, 1, 3, 1, 4, 2, 1, 2, 2, 2, 3, 2, 4, 2, 5, 2, 6, 3, 3, 3, 4, 4, 3, 4, 4, 5, 3, 5, 4, 6, 4, 6, 5, 6, 6, 6, 7],
                "u": [1, 1, 1, 2, 1, 6, 1, 7, 2, 1, 2, 2, 2, 6, 2, 7, 3, 1, 3, 2, 3, 6, 3, 7, 4, 1, 4, 2, 4, 6, 4, 7, 5, 1, 5, 2, 5, 5, 5, 6, 5, 7, 6, 2, 6, 3, 6, 4, 6, 5, 6, 6, 6, 7],
                "v": [1, 1, 1, 2, 1, 6, 1, 7, 2, 2, 2, 3, 2, 5, 2, 6, 3, 2, 3, 3, 3, 5, 3, 6, 4, 3, 4, 4, 4, 5, 5, 4, 5, 5, 6, 4],
                "w": [0, 0, 0, 1, 0, 6, 0, 7, 1, 0, 1, 1, 1, 6, 1, 7, 2, 0, 2, 1, 2, 3, 2, 4, 2, 6, 2, 7, 3, 0, 3, 1, 3, 3, 3, 4, 3, 6, 3, 7, 4, 0, 4, 1, 4, 3, 4, 4, 4, 6, 4, 7, 5, 0, 5, 1, 5, 2, 5, 3, 5, 4, 5, 5, 5, 6, 5, 7, 6, 1, 6, 2, 6, 3, 6, 4, 6, 5, 6, 6],
                "x": [1, 1, 1, 2, 1, 6, 1, 7, 2, 2, 2, 3, 2, 5, 2, 6, 3, 3, 3, 4, 3, 5, 4, 3, 4, 4, 4, 5, 5, 2, 5, 3, 5, 5, 5, 6, 6, 1, 6, 2, 6, 6, 6, 7],
                "y": [1, 1, 1, 2, 1, 5, 1, 6, 2, 1, 2, 2, 2, 5, 2, 6, 3, 2, 3, 3, 3, 4, 3, 5, 4, 3, 4, 4, 5, 2, 5, 3, 6, 1, 6, 2],
                "z": [1, 2, 1, 3, 1, 4, 1, 5, 1, 6, 1, 7, 2, 6, 2, 7, 3, 5, 3, 6, 4, 4, 4, 5, 5, 3, 5, 4, 6, 2, 6, 3, 6, 4, 6, 5, 6, 6, 6, 7],
                "A": [0, 3, 0, 4, 1, 2, 1, 3, 1, 4, 1, 5, 2, 2, 2, 3, 2, 4, 2, 5, 3, 1, 3, 2, 3, 5, 3, 6, 4, 1, 4, 2, 4, 3, 4, 4, 4, 5, 4, 6, 5, 1, 5, 2, 5, 5, 5, 6, 6, 0, 6, 1, 6, 6, 6, 7],
                "B": [0, 1, 0, 2, 0, 3, 0, 4, 0, 5, 0, 6, 1, 1, 1, 2, 1, 3, 1, 6, 1, 7, 2, 1, 2, 2, 2, 6, 2, 7, 3, 1, 3, 2, 3, 3, 3, 4, 3, 5, 3, 6, 4, 1, 4, 2, 4, 3, 4, 6, 4, 7, 5, 1, 5, 2, 5, 6, 5, 7, 6, 1, 6, 2, 6, 3, 6, 4, 6, 5, 6, 6],
                "C": [0, 2, 0, 3, 0, 4, 0, 5, 0, 6, 1, 1, 1, 2, 2, 0, 2, 1, 3, 0, 3, 1, 4, 0, 4, 1, 5, 1, 5, 2, 6, 2, 6, 3, 6, 4, 6, 5, 6, 6],
                "D": [0, 1, 0, 2, 0, 3, 0, 4, 0, 5, 0, 6, 1, 1, 1, 2, 1, 6, 1, 7, 2, 1, 2, 2, 2, 6, 2, 7, 3, 1, 3, 2, 3, 6, 3, 7, 4, 1, 4, 2, 4, 6, 4, 7, 5, 1, 5, 2, 5, 6, 5, 7, 6, 1, 6, 2, 6, 3, 6, 4, 6, 5, 6, 6],
                "E": [0, 1, 0, 2, 0, 3, 0, 4, 0, 5, 0, 6, 1, 1, 1, 2, 2, 1, 2, 2, 3, 1, 3, 2, 3, 3, 3, 4, 3, 5, 3, 6, 4, 1, 4, 2, 5, 1, 5, 2, 6, 1, 6, 2, 6, 3, 6, 4, 6, 5, 6, 6],
                "F": [0, 1, 0, 2, 0, 3, 0, 4, 0, 5, 0, 6, 1, 1, 1, 2, 2, 1, 2, 2, 3, 1, 3, 2, 3, 3, 3, 4, 3, 5, 3, 6, 4, 1, 4, 2, 5, 1, 5, 2, 6, 1, 6, 2],
                "G": [0, 2, 0, 3, 0, 4, 0, 5, 0, 6, 1, 1, 1, 2, 2, 0, 2, 1, 3, 0, 3, 1, 3, 4, 3, 5, 3, 6, 4, 0, 4, 1, 4, 6, 5, 1, 5, 2, 5, 6, 6, 2, 6, 3, 6, 4, 6, 5, 6, 6],
                "H": [0, 1, 0, 2, 0, 6, 0, 7, 1, 1, 1, 2, 1, 6, 1, 7, 2, 1, 2, 2, 2, 6, 2, 7, 3, 1, 3, 2, 3, 3, 3, 4, 3, 5, 3, 6, 3, 7, 4, 1, 4, 2, 4, 6, 4, 7, 5, 1, 5, 2, 5, 6, 5, 7, 6, 1, 6, 2, 6, 6, 6, 7],
                "I": [0, 2, 0, 3, 0, 4, 0, 5, 0, 6, 1, 4, 2, 4, 3, 4, 4, 4, 5, 4, 6, 1, 6, 2, 6, 3, 6, 4, 6, 5, 6, 6, 6, 7],
                "J": [0, 2, 0, 3, 0, 4, 0, 5, 0, 6, 1, 5, 1, 6, 2, 5, 2, 6, 3, 5, 3, 6, 4, 1, 4, 2, 4, 5, 4, 6, 5, 1, 5, 2, 5, 5, 5, 6, 6, 2, 6, 3, 6, 4, 6, 5],
                "K": [0, 1, 0, 2, 0, 5, 0, 6, 1, 1, 1, 2, 1, 4, 1, 5, 2, 1, 2, 2, 2, 3, 2, 4, 3, 1, 3, 2, 3, 3, 4, 1, 4, 2, 4, 3, 4, 4, 5, 1, 5, 2, 5, 4, 5, 5, 6, 1, 6, 2, 6, 5, 6, 6],
                "L": [0, 1, 0, 2, 1, 1, 1, 2, 2, 1, 2, 2, 3, 1, 3, 2, 4, 1, 4, 2, 5, 1, 5, 2, 6, 1, 6, 2, 6, 3, 6, 4, 6, 5, 6, 6],
                "M": [0, 1, 0, 2, 0, 6, 0, 7, 1, 1, 1, 2, 1, 3, 1, 5, 1, 6, 1, 7, 2, 1, 2, 2, 2, 4, 2, 6, 2, 7, 3, 1, 3, 2, 3, 6, 3, 7, 4, 1, 4, 2, 4, 6, 4, 7, 5, 1, 5, 2, 5, 6, 5, 7, 6, 1, 6, 2, 6, 6, 6, 7],
                "N": [0, 1, 0, 2, 0, 6, 0, 7, 1, 1, 1, 2, 1, 3, 1, 6, 1, 7, 2, 1, 2, 2, 2, 4, 2, 6, 2, 7, 3, 1, 3, 2, 3, 5, 3, 6, 3, 7, 4, 1, 4, 2, 4, 6, 4, 7, 5, 1, 5, 2, 5, 6, 5, 7, 6, 1, 6, 2, 6, 6, 6, 7],
                "O": [0, 2, 0, 3, 0, 4, 0, 5, 1, 1, 1, 2, 1, 5, 1, 6, 2, 0, 2, 1, 2, 6, 2, 7, 3, 0, 3, 1, 3, 6, 3, 7, 4, 0, 4, 1, 4, 6, 4, 7, 5, 1, 5, 2, 5, 5, 5, 6, 6, 2, 6, 3, 6, 4, 6, 5],
                "P": [0, 1, 0, 2, 0, 3, 0, 4, 0, 5, 0, 6, 1, 1, 1, 2, 1, 3, 1, 6, 1, 7, 2, 1, 2, 2, 2, 6, 2, 7, 3, 1, 3, 2, 3, 3, 3, 4, 3, 5, 3, 6, 4, 1, 4, 2, 5, 1, 5, 2, 6, 1, 6, 2],
                "Q": [0, 2, 0, 3, 0, 4, 0, 5, 1, 1, 1, 2, 1, 5, 1, 6, 2, 0, 2, 1, 2, 6, 2, 7, 3, 0, 3, 1, 3, 6, 3, 7, 4, 0, 4, 1, 4, 4, 4, 6, 4, 7, 5, 1, 5, 2, 5, 5, 5, 6, 6, 2, 6, 3, 6, 4, 6, 5, 6, 6, 6, 7],
                "R": [0, 1, 0, 2, 0, 3, 0, 4, 0, 5, 0, 6, 1, 1, 1, 2, 1, 3, 1, 6, 1, 7, 2, 1, 2, 2, 2, 6, 2, 7, 3, 1, 3, 2, 3, 3, 3, 4, 3, 5, 3, 6, 4, 1, 4, 2, 4, 5, 5, 1, 5, 5, 6, 2, 6, 1, 6, 2, 6, 6],
                "S": [0, 2, 0, 3, 0, 4, 0, 5, 0, 6, 1, 1, 1, 2, 2, 1, 2, 2, 3, 2, 3, 3, 3, 4, 3, 5, 4, 5, 4, 6, 5, 5, 5, 6, 6, 1, 6, 2, 6, 3, 6, 4, 6, 5, 6, 6],
                "T": [0, 1, 0, 2, 0, 3, 0, 4, 0, 5, 0, 6, 0, 7, 1, 4, 2, 4, 3, 4, 4, 4, 5, 4],
                "U": [0, 1, 0, 2, 0, 6, 0, 7, 1, 1, 1, 2, 1, 6, 1, 7, 2, 1, 2, 2, 2, 6, 2, 7, 3, 1, 3, 2, 3, 6, 3, 7, 4, 1, 4, 2, 4, 6, 4, 7, 5, 1, 5, 2, 5, 6, 5, 7, 6, 2, 6, 3, 6, 4, 6, 5, 6, 6],
                "V": [0, 0, 0, 1, 0, 6, 0, 7, 1, 1, 1, 2, 1, 6, 1, 7, 2, 1, 2, 2, 2, 6, 2, 7, 3, 2, 3, 3, 3, 5, 3, 6, 4, 3, 4, 4, 4, 5, 4, 6, 5, 4, 5, 5, 6, 4],
                "W": [0, 1, 0, 2, 0, 6, 0, 7, 1, 1, 1, 2, 1, 6, 1, 7, 2, 1, 2, 2, 2, 6, 2, 7, 3, 1, 3, 2, 3, 6, 3, 7, 4, 1, 4, 2, 4, 4, 4, 6, 4, 7, 5, 1, 5, 2, 5, 3, 5, 5, 5, 6, 5, 7, 6, 1, 6, 2, 6, 6, 6, 7],
                "X": [0, 0, 0, 1, 0, 6, 0, 7, 1, 1, 1, 2, 1, 5, 1, 6, 2, 1, 2, 2, 2, 5, 2, 6, 3, 2, 3, 3, 3, 4, 3, 5, 4, 2, 4, 3, 4, 4, 4, 5, 5, 1, 5, 2, 5, 5, 5, 6, 6, 0, 6, 1, 6, 6, 6, 7],
                "Y": [0, 0, 0, 1, 0, 6, 0, 7, 1, 0, 1, 1, 1, 6, 1, 7, 2, 1, 2, 2, 2, 5, 2, 6, 3, 2, 3, 3, 3, 4, 3, 5, 4, 3, 4, 4, 5, 3, 5, 4, 6, 3, 6, 4],
                "Z": [0, 1, 0, 2, 0, 3, 0, 4, 0, 5, 0, 6, 0, 7, 1, 6, 1, 7, 2, 5, 2, 6, 3, 4, 3, 5, 4, 2, 4, 3, 5, 1, 5, 2, 6, 1, 6, 2, 6, 3, 6, 4, 6, 5, 6, 6, 6, 7],
                ",": [5, 3, 5, 4, 5, 5, 6, 4, 6, 5, 7, 3, 7, 4],
                ":": [1, 3, 1, 4, 1, 5, 2, 3, 2, 4, 2, 5, 4, 3, 4, 4, 4, 5, 5, 3, 5, 4, 5, 5],
                "%": [0, 6, 0, 7, 1, 1, 1, 2, 1, 5, 1, 6, 2, 1, 2, 2, 2, 4, 2, 5, 3, 3, 3, 4, 4, 2, 4, 3, 5, 1, 5, 2, 5, 4, 5, 5, 6, 0, 6, 1, 6, 4, 6, 5],
                "!": [0, 3, 0, 4, 0, 5, 1, 3, 1, 4, 1, 5, 2, 3, 2, 4, 2, 5, 3, 3, 3, 4, 3, 5, 4, 3, 4, 4, 4, 5, 5, 3, 5, 4, 5, 5, 7, 4],
                "(": [0, 2, 0, 3, 1, 1, 1, 2, 2, 1, 2, 2, 3, 1, 3, 2, 4, 1, 4, 2, 5, 1, 5, 2, 6, 1, 6, 2, 7, 2, 7, 3],
                ")": [0, 5, 0, 6, 1, 6, 1, 7, 2, 6, 2, 7, 3, 6, 3, 7, 4, 6, 4, 7, 5, 6, 5, 7, 6, 6, 6, 7, 7, 5, 7, 6],
                ".": [5, 3, 5, 4, 5, 5, 6, 3, 6, 4, 6, 5, 7, 3, 7, 4, 7, 5]
            },
              
            frame: {
                  
                backgroundImageUrl: null,
                  
                innerWidth: 6,
                  
                outerWidth: 10,
            },
              
            height: 150,
              
            width: 400,
              
            enableResize: false,
              
            isResponsive: false,
              
            themes: "flatlight",
              
            items: null,
              
            init: null,
              
            load: null,

            doubleClick: '',

            rightClick: '',

            click: '',
              
            renderComplete: null,
              
            itemRendering: null,
              
            value: "text",
			themeProperties:{
			 flatlight: {
            items: {
                segmentSettings: {
                    color: "#232323",
                },
                shadowColor: "#232323",
                textColor: "#232323"
            }
        },
          
        flatdark: {
            items: {
                segmentSettings: {
                    color: "#b1b0b0",
                },
                shadowColor: "#b1b0b0",
                textColor: "#b1b0b0"
            }
        }
			}
        },

          
        dataTypes: {
            segmentData: "data",
            matrixSegmentData: "data",
            items: "array",
            isResponsive: "boolean",
        },

          
        _setValues: function () {
            this.gaugeEl = this.element;
            this.segmentCount = null;
            this.contextEl = null;
            this.style = null;
            this._value = null;
            this.region = null;
            this.canvasEl = null;
            this.segement16X = null;
            this.segment16Y = null;
            this.segmentHeight = null;
            this.segmentAngle = null;
            this.startX = 5;
            this.startY = 5;
            this.gradient = null;
            this.itemIndex = null;
            this.characterSpace = null;
            this.outerImage = null;
            this.radius = null;
            this.frameOuterLocation = null;
            this.frameInnerLocation = null;
            this.glassFrameLocation = null;
            this.glassFrameStyle = null;
            this.frameOuterStyle = null;
            this.character = null;
            this.frameInnerStyle = null;
            this._itemInitialize();
        },
        observables: ["value"],
        _tags: [{
            tag: "items",
            attr: ["textAlign","textColor","characterSettings.count", "characterSettings.opacity", "characterSettings.spacing", "characterSettings.type", "enableCustomFont", "segmentSettings.color", "segmentSettings.gradient", "segmentSettings.length", "segmentSettings.opacity", "segmentSettings.spacing", "segmentSettings.width", "shadowBlur", "shadowOffsetX", "shadowOffsetY", "textAlign", "shadowColor", "textColor", "font.size", "font.fontFamily", "font.fontStyle", "position.x", "position.y"]
        }],
        value: ej.util.valueFunction("value"),


          
        _destroy: function () {
            this._unwireEvents();
            this.element.empty().removeClass("e-digitalgauge e-js e-widget");
        },
          
        _setModel: function (options) {
            var option;
            for (option in options) {
                switch (option) {
                    case "height":
                        this.model.height = options[option];
                        break;
                    case "width":
                        this.model.width = options[option];
                        break;
                    case "items":
                        this.model.items = options[option];
                        this._itemInitialize();
                        break;
                    case "frame":
                        $.extend(this.model.frame, options[option]); break;
                    case "themes": this.model.themes = options[option]; break;
                    case "value":
                        for (var i = 0; this.model.items[i] != null; i++)
                            this.model.items[i].value = this.value();
                        break;
                }
            }
            this.refresh();
        },
          
        _init: function () {
            _digitalGaugeCount = $(".e-digitalgauge").length;
            initialGaugeCount = _digitalGaugeCount;
            this._setValues();
            this._trigger("load");
            this._setTheme();
            this._initialize();
            this._onWindowResize();
        },
          
        _onWindowResize: function () {
            if (this.model.enableResize || this.model.isResponsive) {
                if (!ej.isTouchDevice())
                    this._on($(window), "resize", this.resizeCanvas);
                else
                    this._on($(window), "orientationchange", this.resizeCanvas);
            }
        },
          
        _setTheme: function () {
            var selectedThem = this.model.themeProperties[this.model.themes];
            this._setThemeColors(selectedThem);
        },
          
        _setThemeColors: function (selectedThem) {
            var result = [], jsonObj = this.model.themeProperties;
            for (var name in jsonObj) {
                result.push(name);
            }
            for (var th = 0; th < result.length; th++) {
                for (var i = 0; i < this.model.items.length; i++) {
                    this.model.items[i].segmentSettings.color = (ej.isNullOrUndefined(this.model.items[i].segmentSettings.color) || this.model.items[i].segmentSettings.color == jsonObj[result[th]].items.segmentSettings.color) ? selectedThem.items.segmentSettings.color : this.model.items[i].segmentSettings.color;
                    this.model.items[i].shadowColor = (!this.model.items[i].shadowColor || this.model.items[i].shadowColor == jsonObj[result[th]].items.shadowColor) ? selectedThem.items.shadowColor : this.model.items[i].shadowColor;
                    this.model.items[i].textColor = (!this.model.items[i].textColor || this.model.items[i].textColor == jsonObj[result[th]].items.textColor) ? selectedThem.items.textColor : this.model.items[i].textColor;
                }
            }
        },

        _wireEvents: function(){
            this._on($(this.canvasEl), "touchstart", this._dgStart);
            this._on($(this.canvasEl), ej.isTouchDevice() ? "touchend" : "mouseup", this._dgClick);
            this._on($(this.canvasEl), "contextmenu", this._dgRightClick);
        },

        _unwireEvents: function(){
            this._off($(this.canvasEl), "touchstart", this._dgStart);
            this._off($(this.canvasEl), ej.isTouchDevice() ? "touchend" : "mouseup", this._dgClick);            
            this._off($(this.canvasEl), "contextmenu", this._dgRightClick);
        },
          
        _initialize: function () {
            if (this.model.init)
                this._clientSideOnInit();
            this._initObject(this);
            if (this.model.load)
                this._clientSideOnLoad();
            if (this.model.frame.backgroundImageUrl != null)
                this._drawCustomImage(this, this.model.frame.backgroundImageUrl);
            else
                this._renderItems();
            if (this.model.renderComplete)
                this._clientSideOnRenderComplete();
            this._wireEvents();
        },

        _dgStart: function(){
            if(ej.isTouchDevice() && this.model.rightClick != '')
                this._longPressTimer = new Date();
        },

        _dgClick: function(e){
            var end = new Date();
            if(this.model.click != '')
                this._trigger("click", {data:{event: e}});
            
            if(this._doubleTapTimer != null && end - this._doubleTapTimer < 300)
                this._dgDoubleClick(e);
            this._doubleTapTimer = end;
            if(ej.isTouchDevice() && this.model.rightClick != '' && new Date() - this._longPressTimer > 1500)
                this._dgRightClick(e);
        },

        _dgDoubleClick: function(e){
            if(this.model.doubleClick != '')
                this._trigger("doubleClick", {data:{event: e}});
            
        },
    
        _dgRightClick: function(e){
            if(this.model.rightClick != '')
                this._trigger("rightClick", {data:{event: e}});            
        },
          
        _itemInitialize: function () {
            var proxy = this;
            if (this.model.items != null) {
                $.each(this.model.items, function (index, element) {
                    var obj = proxy._sendDefaultItem();
                    $.extend(true, obj, element);
                    $.extend(true, element, obj);
                });
            }
            else {
                this.model.items = [this._sendDefaultItem()];
            }
        },
          
        _sendDefaultItem: function () {
            var defaultItems;
            return defaultItems = {
                  
                characterSettings: {
                      
                    count: 4,
                       
                    opacity: 1,
                      
                    spacing: 2,
                      
                    type:ej.datavisualization.DigitalGauge.CharacterType.EightCrossEightDotMatrix,
                },
                  
                enableCustomFont: false,
                  
                segmentSettings: {
                      
                    color: null,
                      
                    gradient:null,
                       
                    length: 2,
                      
                    opacity: 0,
                      
                    spacing: 1,
                      
                    width: 1,
                },
                  
                shadowBlur: 0,
                  
                shadowOffsetX: 1,
                  
                shadowOffsetY: 1,
                  
                textAlign: "left",
                  
                font:   {
                      
                    size: "11px",
                      
                    fontFamily: "Arial",
                      
                    fontStyle: "italic"
                },
                  
                position: {
                      
                    x: 0,
                      
                    y: 0
                },
                  
                shadowColor: null,
                  
                textColor: null,
                  
                value: null
            };
        },
          
        _initObject: function (element) {
            this.element.addClass("e-widget");
            element.gaugeEl = this.element;
            for (var i = 0; this.model.items[i] != null; i++) {
                if (this.model.items[i].value == null)
                    this.model.items[i].value = this.value();
            }
            if (element.canvasEl)
                element.canvasEl.parent().empty();
            element.canvasEl = $("<canvas></canvas>");
            element.gaugeEl.append(element.canvasEl);
            element.canvasEl.attr("role", "presentation");
            if (_digitalGaugeCount == initialGaugeCount) {
                initialDigitalDivWidth = window.innerWidth;
            }
            element.canvasEl[0].setAttribute("width", element.model.width);
            element.canvasEl[0].setAttribute("height", element.model.height);
            element.centerX = element.canvasEl[0].width / 2;
            element.centerY = element.canvasEl[0].height / 2;
            var elem = element.canvasEl[0];
            if (typeof window.G_vmlCanvasManager != "undefined") {
                elem = window.G_vmlCanvasManager.initElement(elem);
            }
            if (!elem || !elem.getContext) {
                return;
            }
            element.contextEl = element.canvasEl[0].getContext("2d");
        },
          
        _drawCustomImage: function (element, imageUrl) {
            var image = new Image();
            $(image).on('load', function () {
                element.contextEl.drawImage(this, 0, 0, element.model.width, element.model.height);
                if (element.model.Scales != null)
                    element._drawScales();
                if (element.model.items != null)
                    element._renderItems();
            }).attr('src', imageUrl);
        },
          
        _setSegmentCount: function (element) {
            switch (element) {
                case "sevensegment": this._SegmentCount = 7; break;
                case "fourteensegment": this._SegmentCount = 14; break;
                case "sixteensegment": this._SegmentCount = 16; break;
                case "eightcrosseightdotmatrix": this._SegmentCount = [8, 8]; break;
                case "eightcrosseightsquarematrix": this._SegmentCount = [8, 8]; break;
                default:
                    this._SegmentCount = 7;
            }

        },
          
        _setInnerPosition: function () {
            this.contextEl.save();
            this.contextEl.translate(this.model.frame.outerWidth + this.model.frame.innerWidth, this.model.frame.outerWidth + this.model.frame.innerWidth);
            this.bounds = {
                height: this.canvasEl[0].height - 2 * (this.model.frame.outerWidth + this.model.frame.innerWidth),
                width: this.canvasEl[0].width - 2 * (this.model.frame.outerWidth + this.model.frame.innerWidth)
            };
        },
          
        _setWidth: function () {
            var characterCount = [];
            if (this.model.items != null) {
                $.each(this.model.items, function (index, element) {
                    characterCount.push(element.characterSettings.count);
                });
            }
        },

          
        _renderItems: function () {
            if (this.model.items != null) {
                this._setInnerPosition();
                var self = this;
                $.each(this.model.items, function (index, element) {
                    self._setSegmentCount(element.characterSettings.type);
                    self.itemIndex = index;
                    self.canvasEl.attr("aria-label", element.value);
                    self._setShadow(index, element);
                    if (element.enableCustomFont)
                        self._setCustomFont(index, element);
                    else if (element.characterSettings.type.indexOf("matrix") != -1)
                        self._drawMatrixSegments(index, element);
                    else
                        self._drawSegments(index, element);
                });
            }
        },

          
        _setGradientColor: function (element, gradient, options) {
            if (options.Name || typeof (options) === "string") {
                gradient.addColorStop(0, this._getColor(element, options));
                gradient.addColorStop(1, this._getColor(element, options));
            }
            else
                $.each(options, function (index, colorElement) {
                    gradient.addColorStop(colorElement.colorStop != NaN ? colorElement.colorStop : 0, typeof (colorElement.color) === "string" ? colorElement.color : this._getColor(element, colorElement.color));
                });
        },

          
        _getColor: function (element, option) {
            if (typeof (option) === "string") {
                return option;
            }
            else {
                return ("rgba(" + option.R + ", " + option.G + "," + option.B + ", " + option.A / 255 + ")");
            }
        },

          
        _drawMatrixSegments: function (index, element) {
            var segmentXCollection = [], segmentCollection = [];
            if (element.value) {
                this._value = element.value.toString().split('');
                  
                element.characterSettings.count = (this._value.length > 4)?this._value.length:4;
            }
            else
                this._value = "";
            this.radius = (element.characterSettings.type.indexOf("dot") != -1) ? (element.segmentSettings.length + element.segmentSettings.width) / 2 : element.segmentSettings.width / 2;
            var controlStartX = this.startX = (this.bounds.width - element.characterSettings.count * (this._SegmentCount[0] * (2 * this.radius) + element.characterSettings.spacing + this._SegmentCount[0] * element.segmentSettings.spacing)) * (element.position.x / 100);
            var controlStartY = this.startY = (this.bounds.height - (this._SegmentCount[1] * ((element.characterSettings.type.indexOf("dot") != -1) ? 2 * this.radius : element.segmentSettings.length) + this._SegmentCount[1] * element.segmentSettings.spacing)) * (element.position.y / 100);
            for (var character = 0; character < element.characterSettings.count; character++) {
                if (this._value) {
                    this.character = element.textAlign == "right" ? this._value[this._value.length - element.characterSettings.count + character] : this._value[character];
                    segmentCollection = this.model.matrixSegmentData[this.character];
                }
                if (character != 0) {
                    controlStartX = this.startX = this.startX + element.characterSettings.spacing + element.segmentSettings.spacing + (2 * this.radius);
                    this.startY = controlStartY;
                }
                for (var dotY = 0; dotY < this._SegmentCount[1]; dotY++) {
                    if (dotY != 0) {
                        this.startY = ((element.characterSettings.type.indexOf("dot") != -1) ? (2 * this.radius) : element.segmentSettings.length) + this.startY + element.segmentSettings.spacing;
                        this.startX = controlStartX;
                    }
                    if (segmentCollection) {
                        $.each(segmentCollection, function (segIndex) {
                            if (segIndex % 2 == 0) {
                                if (segmentCollection[segIndex] > dotY)
                                    return false;
                                if (segmentCollection[segIndex] == dotY)
                                    segmentXCollection.push(parseInt(segmentCollection[segIndex + 1]));
                            }
                        });
                    }
                    for (var dotX = 0; dotX < this._SegmentCount[0]; dotX++) {
                        if (dotX != 0)
                            this.startX = this.startX + 2 * this.radius + element.segmentSettings.spacing;
                        if (element.characterSettings.type.indexOf("dot") != -1)
                            this.gradient = this.contextEl.createRadialGradient(0, 0, 0, 0, 0, this.radius);
                        else
                            this.gradient = this.contextEl.createLinearGradient(0, 0, element.segmentSettings.width, 0);
                        if (element.segmentSettings.gradient)
                            this._setGradientColor(this, this.gradient, element.segmentSettings.gradient.colorInfo);
                        this.region = { "startX": this.startX, "startY": this.startY };
                        this.style = {
                            "opacity": (segmentXCollection && ($.inArray(dotX, segmentXCollection)) != -1) ? element.characterSettings.opacity : element.segmentSettings.opacity,
                            "height": element.segmentSettings.length,
                            "width": element.segmentSettings.width,
                            "fillStyle": ((element.segmentSettings.color == "transparent") ? "rgba(0,0,0,0)" : this._getColor(this, element.segmentSettings.color)),
                            "skewX": element.SkewAngleX,
                            "skewY": element.SkewAngleX
                        };
                        if (this.model.itemRendering)
                            this._clientSideOnItemRendering(true, dotX, dotY);
                        if (element.characterSettings.type.indexOf("dot") != -1)
                            this._drawDot(this.region, this.style);
                        else
                            this._drawSquare(this.region, this.style);
                    }
                    segmentXCollection = [];
                }
            }
        },

          
        _drawSegments: function (index, element) {
            var segmentCollection = [];
            if (element.value) {
                this._value = element.value.toUpperCase().toString().split('');
                //beyond the four character it align in center. else it align left
                element.characterSettings.count = (this._value.length > 4) ? this._value.length : 4;
            }
            this.characterSpace = element.characterSettings.type == "sevensegment" ? 2 * element.segmentSettings.width : 4 * element.segmentSettings.width;
            this._renderSegmentCalculation(element);
            this.gradient = this.contextEl.createLinearGradient(0, 0, 0, element.segmentSettings.width);
            if (element.segmentSettings.color)
                this._setGradientColor(this, this.gradient, element.segmentSettings.color);
            else if (element.segmentSettings.gradient)
                this._setGradientColor(this, this.gradient, element.segmentSettings.gradient.colorInfo);
            //else
            //    this._setGradientColor(this, this.gradient, this.model.segmentColor);
            for (var character = 0; character < element.characterSettings.count; character++) {
                if (element.value)
                    segmentCollection = this.model.segmentData[element.textAlign == "right" ? this._value[this._value.length - element.characterSettings.count + character] : this._value[character]];
                for (var segment = 0; segment < this._SegmentCount; segment++) {
                    if (character != 0)
                        this.segment16X[segment] = this.segment16X[segment] + element.segmentSettings.length + this.characterSpace + element.characterSettings.spacing;
                    if (this._value)
                        this.character = element.textAlign == "right" ? this._value[this._value.length - element.characterSettings.count + character] : this._value[character];
                    this.region = { "startX": this.segment16X[segment], "startY": this.segment16Y[segment] };
                    this.style = {
                        "angle": this.angle[segment],
                        "fillStyle": this.gradient,
                        "isStroke": false,
                        "isFill": true,
                        "characterHeight": element.characterSettings.type == "sevensegment" ? element.segmentSettings.length : this.segmentHeight[segment],
                        "segmentWidth": element.segmentSettings.width,
                        "opacity": (segmentCollection && ($.inArray(segment, segmentCollection) != -1)) ? element.characterSettings.opacity : element.segmentSettings.opacity
                    };
                    if (this.model.itemRendering)
                        this._clientSideOnItemRendering(false, segment);
                    this._drawSegmentLayers(this.region, this.style);
                }
                if (this._notifyArrayChange)
                    this._notifyArrayChange("items[" + index + "]value", element.value);
                this.value(element.value);
                segmentCollection = [];
            }
        },

        
        _setCustomFont: function (index, element) {
            this.startX = (this.bounds.width - this._measureText(element.value, 0, this._getFontString(this, element.font)).width) * (element.position.x / 100);
            this.startY = (this.bounds.height - this._measureText(element.value, 0, this._getFontString(this, element.font)).height) * (element.position.y / 100);
            this.region = { "startX": this.startX, "startY": this.startY };
            this.style = { "font": this._getFontString(this, element.font), "text": element.value, "textColor": element.textColor ? ((element.textColor == "transparent") ? "rgba(0,0,0,0)" : this._getColor(this, element.textColor)) : ((element.segmentSettings.color == "transparent") ? "rgba(0,0,0,0)" : this._getColor(this, element.segmentSettings.color)) };
            if (this.model.itemRendering)
                this._clientSideOnItemRendering(false, segment);
            this._drawText(this.region, this.style);
        },

          
        _getFontString: function (element, font) {
            return ((font.size == null) ? "11px" : font.size) + " " + font.fontFamily + " " + (font.fontStyle ? font.fontStyle : "");
        },

          
        _renderSegmentCalculation: function (element) {
            var length = element.segmentSettings.length, width = element.segmentSettings.width;
            this.startX = (this.bounds.width - element.characterSettings.count * (length + this.characterSpace + element.characterSettings.spacing)) * (element.position.x / 100);
            this.startY = (this.bounds.height - 2 * length - width) * (element.position.y / 100);
            var tempLength = element.characterSettings.type == "sevensegment" ? length : length / 2;
            this.segment16X = [
                  this.startX + width / 2,
                  this.startX + length + 4 * width,
                  this.startX + length + 4 * width,
                  this.startX + width / 2,
                  this.startX,
                  this.startX,
                  this.startX + width / 2,
                  this.startX + tempLength + 2 * width,
                  this.startX + 2.5 * width + tempLength,
                  this.startX + tempLength + 2 * width,
                  this.startX + length + 2.5 * width,
                  this.startX + tempLength + 2.5 * width,
                  this.startX + tempLength + 1.5 * width,
                  this.startX + 1.5 * width,
                  this.startX + 5 * width / 2 + tempLength,
                  this.startX + 2.5 * width + tempLength
            ];
            this.segment16Y = [
                  this.startY,
                  this.startY,
                  this.startY + length + width,
                  this.startY + 2 * length + 2 * width,
                  this.startY + length + width,
                  this.startY,
                  this.startY + length + width,
                  this.startY + length + width,
                  this.startY + length + width,
                  this.startY,
                  this.startY + width,
                  this.startY + length + width,
                  this.startY + length + width,
                  this.startY + width,
                  this.startY,
                  this.startY + 2 * length + 2 * width
            ];
            this.segmentHeight = [
                  length / 2,
                  length,
                  length,
                  length / 2,
                  length,
                  length,
                  length / 2,
                  length,
                  length / 2,
                  length,
                  length,
                  length,
                  length,
                  length,
                  length / 2,
                  length / 2
            ];
            this.angle = [-90, 0, 0, -90, 0, 0, -90, 0, -90, 0, 27, -27, 27, -27, -90, -90];
            if (element.characterSettings.type == "sevensegment")
                this.segment16X[2] = this.segment16X[1] = this.startX + length + 2 * width;
            if (element.characterSettings.type == "fourteensegment")
                this.segmentHeight[3] = this.segmentHeight[0] = length + 2 * width;
        },

          
        _drawSegmentLayers: function (location, style) {
            this._contextOpenPath(style, this);
            this.contextEl.translate(location.startX, location.startY);
            this.contextEl.rotate(Math.PI * (style.angle / 180));
            this.contextEl.lineTo(0, 0);
            this.contextEl.lineTo(-style.segmentWidth, style.segmentWidth);
            this.contextEl.lineTo(-style.segmentWidth, style.characterHeight);
            this.contextEl.lineTo(0, style.characterHeight + style.segmentWidth);
            this.contextEl.lineTo(style.segmentWidth, style.characterHeight);
            this.contextEl.lineTo(style.segmentWidth, style.segmentWidth);
            this._contextClosePath(style, this);
        },

          
        _drawDot: function (location, style) {
            this.contextEl.beginPath();
            this.contextEl.save();
            this.contextEl.translate(location.startX, location.startY);
            this.contextEl.fillStyle = style.fillStyle;
            this.contextEl.globalAlpha = style.opacity;
            this.contextEl.arc(0, 0, this.radius, 0, 2 * Math.PI, true);
            this.contextEl.fill();
            this.contextEl.closePath();
            this.contextEl.restore();
        },

          
        _setShadow: function (index, element) {
            this.contextEl.save();
            this.contextEl.shadowColor = ((element.shadowColor == "transparent") ? "rgba(0,0,0,0)" : this._getColor(this, element.shadowColor));
            this.contextEl.shadowOffsetY = element.shadowOffsetY;
            this.contextEl.shadowOffsetX = element.shadowOffsetX;
            this.contextEl.shadowBlur = element.shadowBlur;
        },

          
        _drawSquare: function (location, style) {
            this.contextEl.beginPath();
            this.contextEl.save();
            this.contextEl.translate(location.startX, location.startY);
              
            this.contextEl.fillStyle = style.fillStyle;
            this.contextEl.globalAlpha = style.opacity;
            this.contextEl.rect(0, 0, style.width, style.height);
            this.contextEl.fill();
            this.contextEl.closePath();
            this.contextEl.restore();
        },

          

        _drawText: function (location, style) {
            this.contextEl.beginPath();
            this.contextEl.save();
            this.contextEl.font = style.font;
            this.contextEl.textBaseline = "hanging";
            this.contextEl.fillStyle = ((style.textColor == "transparent") ? "rgba(0,0,0,0)" : style.textColor);
            this.contextEl.fillText(style.text, location.startX, location.startY);
            this.contextEl.closePath();
            this.contextEl.restore();
        },

          

        setValue: function (itemIndex, value) {
            if (itemIndex < this.model.items.length && value != null) {
                this.model.items[itemIndex].value = value;
                this._initialize();
            }
        },

          
        getValue: function (itemIndex) {
            return this.model.items[itemIndex].value;
        },

          

        setPosition: function (itemIndex, value) {
            if (itemIndex < this.model.items.length && value != null) {
                this.model.items[itemIndex].position.x = value.x;
                this.model.items[itemIndex].position.y = value.y;
                this._initialize();
            }
        },


          

        getPosition: function (itemIndex) {
            if (itemIndex < this.model.items.length)
                return { "x": this.model.items[itemIndex].position.x, "y": this.model.items[itemIndex].position.y };
            else
                return null;
        },

          
        refresh: function () {
            this._setTheme();
            this._initialize();
        },

        "export" : function(){
            var exports = this.model.exportSettings, image, type ,attr, form, data, input;

            if(exports.mode.toLowerCase() === 'client')
                this.exportImage(exports.fileName, exports.fileType);
            else {
                type = exports.type.toLowerCase() === 'jpg' ? 'image/jpeg' : 'image/png';
                image = this.canvasEl[0].toDataURL(type);
                
                attr = { action: exports.action, method: 'post' };
                form = ej.buildTag('form', "", null, attr);
				data = { name: 'Data', type: 'hidden', value: image};
				input = ej.buildTag('input', "", null, data);
                form.append(input).append(this);
                $('body').append(form);
                form.submit();
            }
        },
          
        exportImage: function (fileName, fileType) {
            /// <summary>This function save the rendered canvas image</summary>
            /// <param name="fileName" type="String">fileName to which the image has been saved</param>
            /// <param name="fileType" type="String">fileType to which the image has been saved</param>
            if (ej.browserInfo().name === "msie" && parseFloat(ej.browserInfo().version) < 10) {
                return false;
            }
            else {
                var image = this.canvasEl[0].toDataURL();
                image = image.replace(/^data:[a-z]*;,/, '');
                var image1 = image.split(',');
                var byteString = atob(image1[1]);
                var buffer = new ArrayBuffer(byteString.length);
                var intArray = new Uint8Array(buffer);
                for (var i = 0; i < byteString.length; i++) {
                    intArray[i] = byteString.charCodeAt(i);
                }
                var blob = new Blob([buffer], { type: "image/png" });
                if (ej.browserInfo().name === "msie")
                    window.navigator.msSaveOrOpenBlob(blob, fileName + '.' + fileType);
                else {
                    var pom = document.createElement('a');
                    var url = URL.createObjectURL(blob);
                    pom.href = url;
                    pom.setAttribute('download', fileName + '.' + fileType);
                    if (document.createEvent) {
                        var e = document.createEvent("MouseEvents");
                        e.initMouseEvent("click", true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
                        pom.dispatchEvent(e);
                    }
                    else if (pom.fireEvent) {
                        pom.fireEvent("onclick");
                    }
                }
                return true;
            }
        },

      
        resizeCanvas: function () {
            if (_digitalGaugeCount != 0)
                _digitalGaugeCount = _digitalGaugeCount - 1;
            else
                _digitalGaugeCount = $(".e-digitalgauge").length - 1; var state, chk = true;
            if (!ej.isNullOrUndefined(this.canvasEl.parent().attr("style")))
                state = this.GaugeEl.parent().attr("style").split(";");
            if (!ej.isNullOrUndefined(state)) {
                $.each(state, function (key, val) {
                    while (val.indexOf("width") != -1) {
                        chk = val.indexOf("px") == -1 ? true : false;
                        break;
                    }
                });
            }
            if (chk) {
                var ratio = window.innerWidth / initialDigitalDivWidth;
                this.model.width *= ratio;
                for (var i = 0; this.model.items[i] != null; i++) {
                    this.model.items[i].segmentSettings.width *= ratio;
                    this.model.items[i].segmentSettings.length *= ratio;
                    this.model.items[i].segmentSettings.spacing *= ratio;
                    this.model.items[i].characterSettings.spacing *= ratio;
                }
                this.refresh();
                if (_digitalGaugeCount == 0) {
                    initialDigitalDivWidth = window.innerWidth;
                }
            }
        },

          
          
        _clientSideOnLoad: function () {
            var data = { object: this, items: this.model.items, context: this.contextEl };
            this._trigger("load", data);
        },

          
        _clientSideOnItemRendering: function (isMatrix, row, column) {
            var data;
            if (isMatrix)
                data = { object: this, items: this.model.items, character: this.character, context: this.contextEl, position: this.region, style: this.style, row: row, column: column };
            else
                data = { object: this, model: this.model, id: this.model.ClientId, items: this.model.items, character: this.character, context: this.contextEl, position: this.region, style: this.style, segment: row };
            this._trigger("itemRendering", data);
        },

          
        _clientSideOnInit: function () {
            var data = { object: this, items: this.model.items, context: this.contextEl };
            this._trigger("init", data);
        },

          
        _clientSideOnRenderComplete: function () {
            var data = { object: this, items: this.model.items, context: this.contextEl };
            this._trigger("renderComplete", data);
        },


          
          
        _contextOpenPath: function (style, element) {
            element.contextEl.save();
            element.contextEl.beginPath();
            if (style.strokeStyle)
                element.contextEl.strokeStyle = style.strokeStyle;
            if (style.opacity != undefined)
                element.contextEl.globalAlpha = style.opacity;
            if (style.lineWidth)
                element.contextEl.lineWidth = style.lineWidth;
            if (style.fillStyle)
                element.contextEl.fillStyle = style.fillStyle;
        },

          
        _contextClosePath: function (style, element) {
            element.contextEl.closePath();
            if (style.isFill)
                element.contextEl.fill();
            if (style.isStroke)
                element.contextEl.stroke();
            element.contextEl.restore();
        },

          
        _measureText: function (text, maxwidth, font) {
            var textObj = document.createElement('DIV');
            textObj.innerHTML = text;
            if (font != null)
                textObj.style.font = font;
            textObj.style.backgroundColor = 'white';
            textObj.style.position = 'absolute';
            textObj.style.top = -100;
            textObj.style.left = 0;
            if (maxwidth)
                textObj.style.maxwidth = maxwidth + "px";
            document.body.appendChild(textObj);
            var bounds = { width: textObj.offsetWidth, height: textObj.offsetHeight };
            $(textObj).remove();
            return bounds;
        }

    });

      
    ej.datavisualization.DigitalGauge.CharacterType = {
          
        SevenSegment: "sevensegment",
          
        FourteenSegment: "fourteensegment",
          
        SixteenSegment: "sixteensegment",
          
        EightCrossEightDotMatrix: "eightcrosseightdotmatrix",
          
        EightCrossEightSquareMatrix: "eightcrosseightsquarematrix"
    };
      
    ej.datavisualization.DigitalGauge.TextAlign = {
          
        Left: "left",
          
        Right: "right"
    };

      
    ej.datavisualization.DigitalGauge.FontStyle = {
          
        Normal: "normal",
          
        Bold: "bold",
          
        Italic: "italic",
          
        Underline: "underline",
          
        Strikeout: "strikeout"
    };

      
    ej.datavisualization.DigitalGauge.Themes = {
         FlatLight: 'flatlight',

		FlatDark: 'flatdark'
    };		
       
  

})(jQuery, Syncfusion);;