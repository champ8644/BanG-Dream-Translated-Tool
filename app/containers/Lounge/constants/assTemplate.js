import path from 'path';

export default function assTemplate(fileName) {
  return `[Script Info]
; Script generated by Aegisub r8942
; http://www.aegisub.org/
Title: ${path.basename(fileName, path.extname(fileName))}
ScriptType: v4.00+
WrapStyle: 0
ScaledBorderAndShadow: yes
YCbCr Matrix: TV.601
PlayResX: 1920
PlayResY: 1440

[Aegisub Project Garbage]
Audio File: ${path.basename(fileName)}
Video File: ${path.basename(fileName)}

[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding
Style: ข้อความ,Layiji MaHaNiYom V1.61,93,&H00524F52,&H000000FF,&H0059606A,&H00000000,0,0,0,0,100,100,0,0,1,0,0,7,125,100,1200,1
Style: ข้อความสั่น,Layiji MaHaNiYom V1.61,93,&H00524F52,&H000000FF,&H0059606A,&H00000000,0,0,0,0,100,100,0,0,1,0,0,7,125,100,1200,1
Style: ชื่อตอน,Layiji MaHaNiYom V1.61,54,&H00524F52,&H000000FF,&H00000000,&H00000000,-1,0,0,0,100,100,0,0,1,0,0,7,50,0,0,1
Style: ชื่อสถานที่,Layiji MaHaNiYom V1.61,93,&H00524F52,&H000000FF,&H0059606A,&H00000000,0,0,0,0,100,100,0,0,1,0,0,2,0,0,673,1

Style: ฉากขาว,Layiji MaHaNiYom V1.61,93,&H00000000,&H000000FF,&H0059606A,&H00000000,0,0,0,0,100,100,0,0,1,0,0,5,0,0,0,1
Style: ฉากดำ,Layiji MaHaNiYom V1.61,93,&H00000000,&H000000FF,&H0059606A,&H00000000,0,0,0,0,100,100,0,0,1,0,0,5,0,0,0,1
Style: Credit,Layiji MaHaNiYom V1.61,80,&H00EEDDFF,&H0006067E,&H007733FF,&H00000000,-1,-1,0,0,100,100,0,0,1,12,2,9,0,70,20,1

[Events]
Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text
Comment: 0,0:00:00.00,0:00:00.00,Credit,,0,0,0,template notext line,!retime("line", 0, 0)!{\\p1\\fad(1000,1000)\\blur0\\1c&H7733FF&\\3c&HEEDDFF&\\fscx35\\fscy35\\bord5\\pos(1885,90)}m 121 7 b 104 -29 98 -29 81 7 b 46 12 49 27 71 43 b 61 81 72 89 101 68 b 129 91 144 80 131 43 b 156 21 154 10 121 7 m 173 -112 l 98 -32 b 99 -26 108 -23 113 -21 l 186 -97 b 190 -104 184 -115 173 -112 m 175 -81 b 187 -87 193 -70 188 -65 l 124 -2 b 122 -7 119 -11 115 -17 m 177 -50 b 186 -50 192 -44 189 -34 l 149 7 b 146 6 137 1 130 0 m 185 2 b 192 -9 187 -20 174 -14 l 153 9 l 151 10 b 159 21 152 28 150 35 m 140 55 l 140 75 b 142 80 144 80 147 77 l 189 30 b 190 19 186 15 174 17
Comment: 0,0:00:00.00,0:00:00.00,Credit,,0,0,0,template line,!retime("line", 0, 0)!{\\fad(1000,1000)\\blur2}
Comment: 0,0:00:00.00,0:00:00.00,ชื่อสถานที่,,0,0,0,template notext line,!retime("line", -400, 400)!{\\p1\\bord0\\shad0\\fscx5000\\fad(400,400)\\c&H7745fa&\\fscy600\\clip(641,679,1727,755)\\t(0,400,\\clip(416,679,1502,755))\\t(1500,1900,\\clip(116,679,1202,755)\\pos(554,850)}m -96 -11 l 140 -11 140 12 -96 12
Comment: 0,0:00:00.00,0:00:00.00,ชื่อสถานที่,,0,0,0,template notext line,!retime("line", -400, 400)!{\\p1\\bord0\\shad0\\fscx5000\\fad(400,400)\\c&HFFFEFF&\\fscy600\\clip(641,679,1727,755)\\t(0,400,\\clip(416,679,1502,755))\\t(1500,1900,\\clip(116,679,1202,755)\\pos(554,850)}m -96 -11 l 140 -11 140 12 -96 12
Comment: 0,0:00:00.00,0:00:00.00,ชื่อสถานที่,,0,0,0,template line,!retime("line",-400, 400)!{\\fad(400,400)\\move(1185,767,960,767,0,400)\\fs$actor\\alpha&H00&\\t(1000,1001,\\alpha&HFF&)}
Comment: 0,0:00:00.00,0:00:00.00,ชื่อสถานที่,,0,0,0,template line,!retime("line", -400, 400)!{\\fad(400,400)\\move(960,767,660,767,1500,1900)\\fs$actor\\alpha&HFF&\\t(1000,1001,\\alpha&H00&)}
Comment: 0,0:00:00.00,0:00:00.00,ชื่อตอน,,0,0,0,template notext line,!retime("line", -510, 330)!{\\an4\\p1\\bord0\\shad0\\fscx1000\\fad(300,300)\\c&HFFFFFF&\\fscy500\\clip(400,20,!$actor+375!,75)\\t(0,200,0.5,\\clip(120,20,!$actor+95!,75))\\t(200,350,1,\\clip(90,20,!$actor+75!,75))\\t(1050,1100,\\clip(70,20,!$actor+55!,75))\\t(1100,1300,\\clip(70,20,!$actor-105!,75))\\t(1300,1500,\\clip(70,20,!$actor-325!,75))\\pos(800.236,85)}m -96 -1 l 100 -1 100 18 -96  18
Comment: 0,0:00:00.00,0:00:00.00,ชื่อตอน,,0,0,0,template line,!retime("line", -510, 330)!{\\an4\\move(300,55,100,55,0,300)\\alpha&HFF&\\t(50,300,\\alpha&H00&\\t(750,751,\\alpha&HFF&))}
Comment: 0,0:00:00.00,0:00:00.00,ชื่อตอน,,0,0,0,template line,!retime("line", -510, 330)!{\\an4\\move(100,55,-100,55,1050,1500)\\alpha&HFF&\\t(750,751,\\alpha&H00&\\t(1100,1300,\\alpha&HFF&))}
Comment: 1,0:00:00.00,0:00:00.00,ฉากดำ,,0,0,0,code line,_, _,fadeIn,fadeOut = string.find(line.actor, "([%d.]*)%p*([%d.]*)");
Comment: 1,0:00:00.00,0:00:00.00,ฉากดำ,,0,0,0,template notext line,!retime("line", 0, 0)!{\\p1\\an5\\bord0\\shad0\\c&000000&\\fade(!fadeIn!,!fadeOut!)}m 0 0 l 1920 0 l 1920 1440 l 0 1440
Comment: 1,0:00:00.00,0:00:00.00,ฉากขาว,,0,0,0,code line,_, _,fadeIn,fadeOut = string.find(line.actor, "([%d.]*)%p*([%d.]*)");
Comment: 1,0:00:00.00,0:00:00.00,ฉากขาว,,0,0,0,template notext line,!retime("line", 0, 0)!{\\p1\\an5\\bord0\\shad0\\c&FFFFFF&\\fade(!fadeIn!,!fadeOut!)}m 0 0 l 1920 0 l 1920 1440 l 0 1440
Comment: 0,0:00:00.00,0:00:00.00,ข้อความ,,0,0,0,code once,name = {}
Comment: 0,0:00:00.00,0:00:00.00,ข้อความ,,0,0,0,code once,colorBackground = "fdfdfd"
Comment: 0,0:00:00.00,0:00:00.00,ข้อความ,,0,0,0,template notext line,!retime("line", 0, 0)!{\\an7\\bord0\\shad0\\p1\\c&H733CFF&\\fscx150\\fscy500\\clip(106,1115,554,1181)\\pos(366.845,1050)}m -200 5 l 200 5 200 32 -200 32
Comment: 0,0:00:00.00,0:00:00.00,ข้อความ,,0,0,0,template notext line,!retime("line", 0, 0)!{\\an7\\bord0\\shad0\\p1\\c&H!colorBackground!&\\fscx800\\fscy3500\\pos(957.2,957)\\clip(90,1198,1820,1407)}m -156 -15 l 120 -15 120 13 -156 13
Comment: 0,0:00:00.00,0:00:00.00,ข้อความ,,0,0,0,template line,
Comment: 0,0:00:00.00,0:00:00.00,ข้อความ,,0,0,0,template notext line,!retime("line", 0, 0)!{\\1c&HFFFFFF&\\shad0.2\\fs95\\pos(130,1150)\\an4}!name[$actor]!
Comment: 0,0:00:00.00,0:00:00.00,ข้อความ,,0,0,0,template notext line,!retime("line", 0, 0)!{\\blur0.1\\bord0\\shad0\\p1\\c&H!colorBackground!&\\fscx750\\fscy1200\\move(961,1274,3350,1274,0,2750)\\clip(90,1198,1820,1296)}m -120 -15 l 120 -15 120 13 -120 13
Comment: 0,0:00:00.00,0:00:00.00,ข้อความ,,0,0,0,template notext line,!retime("line", 0, 0)!{\\blur0.1\\bord0\\shad0\\p1\\c&H!colorBackground!&\\fscx750\\fscy1200\\move(961,1274,3350,1274,2750,5300)\\clip(90,1298,1820,1403)}m -120 -15 l 120 -15 120 13 -120 13
Comment: 0,0:00:00.00,0:00:00.00,ข้อความสั่น,,0,0,0,code once,shake = {}
Comment: 0,0:00:00.00,0:00:00.00,ข้อความสั่น,,0,0,0,code once,_G.table.insert(shake,{{t=0,x=0,y=0},{t=216.667,x=10,y=-12},{t=233.333,x=-4,y=14},{t=250,x=3,y=-6},{t=266.667,x=1,y=9},{t=283.333,x=4,y=5},{t=300,x=2,y=12},{t=316.667,x=-2,y=-2},{t=333.333,x=5,y=5},{t=350,x=4,y=-3},{t=366.667,x=-3,y=6},{t=383.333,x=6,y=7},{t=400,x=3,y=-5},{t=416.667,x=0,y=0},{t=433.333,x=1,y=-5},{t=450,x=-6,y=1},{t=466.667,x=0,y=0},{t=483.333,x=-3,y=-2},{t=500,x=3,y=7},{t=516.667,x=-3,y=-2},{t=533.333,x=1,y=4},{t=550,x=-4,y=5},{t=566.667,x=-3,y=5},{t=583.333,x=2,y=1},{t=600,x=2,y=4},{t=616.667,x=0,y=2},{t=633.333,x=1,y=1},{t=650,x=-1,y=1},{t=666.667,x=-1,y=1},{t=683.333,x=1,y=1},{t=700,x=0,y=2},{t=716.667,x=0,y=1},{t=733.333,x=0,y=0},{t=6383.333,x=0,y=0}})
Comment: 0,0:00:00.00,0:00:00.00,ข้อความสั่น,,0,0,0,code line,_, _,idx,actx = string.find(line.actor, "([%d.]*)%p*([%d.]*)"); id = _G.tonumber(idx); act = _G.tonumber(actx)
Comment: 0,0:00:00.00,0:00:00.00,ข้อความสั่น,,0,0,0,template notext line,!maxloop(_G.table.getn(shake[id])-1)! !retime("preline",shake[id][j].t,shake[id][j+1].t)!{\\an7\\bord0\\shad0\\p1\\c&H733CFF&\\fscx150\\fscy500\\clip(106,1115,554,1181)\\pos(!shake[id][j].x+366.845!,!shake[id][j].y+1050!)}m -200 5 l 200 5 200 32 -200 32
Comment: 0,0:00:00.00,0:00:00.00,ข้อความสั่น,,0,0,0,template notext line,!maxloop(_G.table.getn(shake[id])-1)! !retime("preline",shake[id][j].t,shake[id][j+1].t)!{\\an7\\bord0\\shad0\\p1\\c&H!colorBackground!&\\fscx800\\fscy3500\\pos(!shake[id][j].x+957.2!,!shake[id][j].y+957!)\\clip(90,1198,1820,1407)}m -156 -15 l 120 -15 120 13 -156 13
Comment: 0,0:00:00.00,0:00:00.00,ข้อความสั่น,,0,0,0,template line,!maxloop(_G.table.getn(shake[id])-1)! !retime("preline",shake[id][j].t,shake[id][j+1].t)!{\\pos(!shake[id][j].x+125!,!shake[id][j].y+1200!)}
Comment: 0,0:00:00.00,0:00:00.00,ข้อความสั่น,,0,0,0,template notext line,!maxloop(_G.table.getn(shake[id])-1)! !retime("preline",shake[id][j].t,shake[id][j+1].t)!{\\an4\\1c&HFFFFFF&\\shad0.2\\fs95\\pos(!shake[id][j].x+130!,!shake[id][j].y+1150!)}!name[act]!
Comment: 0,0:00:00.00,0:00:00.00,ข้อความสั่น,,0,0,0,template notext line,!maxloop(_G.table.getn(shake[id])-1)! !retime("preline",shake[id][j].t,shake[id][j+1].t)!{\\blur0.1\\bord0\\shad0\\p1\\c&H!colorBackground!&\\fscx750\\fscy1200\\move(!shake[id][j].x+961!,!shake[id][j].y+1274!,!shake[id][j].x+3350!,!shake[id][j].y+1274!,!0-shake[id][j].t!,!2750-shake[id][j].t!)\\clip(!shake[id][j].x+90!,!shake[id][j].y+1198!,!shake[id][j].x+1820!,!shake[id][j].y+1296!)}m -120 -15 l 120 -15 120 13 -120 13
Comment: 0,0:00:00.00,0:00:00.00,ข้อความสั่น,,0,0,0,template notext line,!maxloop(_G.table.getn(shake[id])-1)! !retime("preline",shake[id][j].t,shake[id][j+1].t)!{\\blur0.1\\bord0\\shad0\\p1\\c&H!colorBackground!&\\fscx750\\fscy1200\\move(!shake[id][j].x+961!,!shake[id][j].y+1274!,!shake[id][j].x+3350!,!shake[id][j].y+1274!,!2750-shake[id][j].t!,!5300-shake[id][j].t!)\\clip(!shake[id][j].x+90!,!shake[id][j].y+1298!,!shake[id][j].x+1820!,!shake[id][j].y+1403!)}m -120 -15 l 120 -15 120 13 -120 13
`;
}
