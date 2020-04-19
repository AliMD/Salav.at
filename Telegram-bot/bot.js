const Telegraf = require('telegraf');
const session = require('telegraf/session')
const bot = new Telegraf('1234542212:AAHIoI2SmhWKvRY-cgBnDaMf8aXB92FKQfo')

// code
var five = 0;
var ten  = 0;
var message_id;
var chat_id;

bot.start((ctx) => {
    ctx.replyWithPoll("how many?",['5','10']);
    // setTimeout(function(){
    //   //send data to website here using api <-

    // }, 12 * 60 * 1000);
});
bot.use(session())
bot.help((ctx) => {

    message_id = ctx.update.message.message_id;
    chat_id = ctx.update.message.chat.id

    console.log(ctx.update.message.message_id);
    console.log(ctx.update.message.chat.id)

    ctx.deleteMessage(chat_id,message_id);
    // console.log(global);
});
bot.on('poll', (ctx) => {
    console.log('yes');

    five = ctx.poll.options[0].voter_count;
    ten  = ctx.poll.options[1].voter_count;

    console.log(ctx.poll.options[0].voter_count);
    console.log(ctx.poll.options[1].voter_count);
  });
bot.command('status', (ctx) => {
  ctx.reply('number of 5s:' + five );
  ctx.reply('number of 10s: ' + ten );
});
bot.launch();
