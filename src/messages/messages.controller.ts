import { Controller , Get, Post, Param, Body} from '@nestjs/common';


@Controller('messages')
export class MessagesController {

    @Get()
    listMessages() {
        
    }

    @Post()
    createMessage( @Body() body: any) {
        console.log(body);
    }

    @Get('/:id')
    getMessage( @Param('id') id: string) {
        console.log(id);       
    }


}
