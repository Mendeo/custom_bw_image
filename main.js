'use strict';
const inputImg = document.getElementById('inputImage');
const blackPower = document.getElementById('blackPower');
const powerSpan = document.querySelector('#blackPower + span');
const outputImg = document.getElementById('outputImage');
const inputFileEl = document.getElementById('inputFile');

blackPowerWidth();
window.addEventListener('resize', blackPowerWidth);
function blackPowerWidth()
{
	blackPower.style=`width: ${inputImg.width}px;`;
}

const refCanvas = document.createElement('canvas');
const refCanvasCtx = refCanvas.getContext('2d', { willReadFrequently: true });

const refImg = new Image();
inputFileEl.addEventListener("change", () =>
{
	refCanvasCtx.clearRect(0, 0, refCanvas.width, refCanvas.height);
	//Даём время на очистку канваса.
	setTimeout(()=>
	{
		const imgFile = inputFileEl.files[0];
		if (imgFile.type.startsWith('image/'))
		{
			const reader = new FileReader();
			reader.readAsDataURL(imgFile);
			reader.addEventListener('load', () =>
			{
				refImg.src = reader.result;
				inputImg.src = refImg.src;
				if (refImg.complete)
				{
					doImageProcess();
				}
				else
				{
					refImg.addEventListener('load', () =>
					{
						doImageProcess();
					});
				}
			});
		}
	}, 0);
});

function doImageProcess()
{
	refCanvas.width = refImg.width;
	refCanvas.height = refImg.height;
	blackPowerWidth();
	refCanvasCtx.drawImage(inputImg, 0, 0);
	const imageDataInitial = refCanvasCtx.getImageData(0, 0, refCanvas.width, refCanvas.height);
	makeBlackWhite(blackPower.valueAsNumber);
	blackPower.addEventListener('input', () =>
	{
		makeBlackWhite(blackPower.valueAsNumber);
	});

	function makeBlackWhite(power)
	{
		powerSpan.innerText = power;
		const imageData = refCanvasCtx.getImageData(0, 0, refCanvas.width, refCanvas.height);
		for (let i = 0; i < imageData.data.length; i += 4)
		{
			const avg = (imageDataInitial.data[i] + imageDataInitial.data[i + 1] + imageDataInitial.data[i + 2]) / 3;
			let pointValue = avg > power ? 255 : 0;
			imageData.data[i] = pointValue; // red
			imageData.data[i + 1] = pointValue; // green
			imageData.data[i + 2] = pointValue; // blue
		}
		refCanvasCtx.putImageData(imageData, 0, 0);
		outputImg.src = refCanvas.toDataURL();
	}
}

