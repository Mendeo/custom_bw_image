'use strict';
const inputImg = document.getElementById('inputImage');
const blackPower = document.getElementById('blackPower');
const powerSpan = document.querySelector('#blackPower + span');
const outputImg = document.getElementById('outputImage');
const inputFileEl = document.getElementById('inputFile');

const refCanvas = document.createElement('canvas');
const refCanvasCtx = refCanvas.getContext('2d', { willReadFrequently: true });

const refImg = new Image();
inputFileEl.addEventListener("change", () =>
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
				main();
			}
			else
			{
				refImg.addEventListener('load', () =>
				{
					main();
				});
			}
		});
	}
});

function main()
{
	refCanvas.width = refImg.width;
	refCanvas.height = refImg.height;
	refCanvasCtx.clearRect(0, 0, refCanvas.width, refCanvas.height)
	console.log(refImg.width);
	refCanvasCtx.drawImage(inputImg, 0, 0);

	const imageDataInitial = refCanvasCtx.getImageData(0, 0, refCanvas.width, refCanvas.height);

	blackPower.style=`width: ${inputImg.width}px;`
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

