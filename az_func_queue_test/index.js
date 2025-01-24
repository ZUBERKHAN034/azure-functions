const axios = require('axios');
const SibApiV3Sdk = require('sib-api-v3-typescript');

const getEmailTemplate = (quote, params) => {
	return `<!DOCTYPE html>
	<html>
	<head>
		<title>Email Template</title>
		<style>
			body {
				font-family: Arial, sans-serif;
				margin: 0;
				padding: 0;
			}
			
			.container {
				max-width: 600px;
				margin: 0 auto;
				padding: 20px;
			}
			
			.message {
				margin-bottom: 20px;
			}
			
			.quote {
				background-color: #f2f2f2;
				padding: 20px;
				border-left: 4px solid #999;
			}
			
			.author {
				font-style: italic;
				color: #999;
				margin-top: 10px;
			}
		</style>
	</head>
	<body>
		<div class="container">
			<div class="message">
				<p>Dear ${params.to.split('@')[0]},</p>
				<p>${params.message}</p>
			</div>
			
			<div class="quote">
				<p>"${quote.text}"</p>
				<p class="author">- ${quote.author}</p>
			</div>
			
			<p>Regards,<br>
			${params.from.split('@')[0]}</p>
		</div>
	</body>
	</html>
	`;
};

const sendEmail = async (from, to, subject, body) => {
	const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

	apiInstance.setApiKey(
		SibApiV3Sdk.TransactionalEmailsApiApiKeys.apiKey,
		process.env.SEND_IN_BLUE_API_KEY
	);

	try {
		const sendSmtpEmail = {
			sender: {
				name: from.split('@')[0],
				email: from,
			},
			to: [
				{
					email: to,
				},
			],
			subject: subject,
			htmlContent: body,
		};
		const emailSendSuccess = await apiInstance.sendTransacEmail(sendSmtpEmail);
		return { status: true, emailSendSuccess };
	} catch (error) {
		return { status: false, error: error };
	}
};

module.exports = async (context, myQueueItem) => {
	const params = JSON.parse(myQueueItem);
	const { from, to, subject } = params;

	try {
		const { data: quotes } = await axios.get(`https://type.fit/api/quotes`);
		const quote = quotes[Math.floor(Math.random() * quotes.length)];

		const body = getEmailTemplate(quote, params);
		await sendEmail(from, to, subject, body);
	} catch (error) {
		context.log(`Error ${error.message}`);
	}
};
