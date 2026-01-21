const fs = require('fs');
const path = require('path');

const outputDir = path.join(__dirname, 'public', 'lyrics');

function interpolateLyrics(title, text, durationSeconds) {
    const lines = text.split('\n')
        .map(l => l.trim())
        .filter(l => l.length > 0 && !l.startsWith('[')); // Filter empty and headers

    if (lines.length === 0) return [];

    const interval = durationSeconds / lines.length;
    const json = lines.map((line, index) => ({
        time: parseFloat((index * interval).toFixed(2)),
        text: line
    }));

    return json;
}

const BATCH_5 = {
    "Mike Posner — I Took A Pill In Ibiza": {
        duration: 200, // 3:20
        text: `I took a pill in Ibiza
To show Avicii I was cool
And when I finally got sober, felt ten years older
But fuck it, it was something to do
I'm living out in LA
I drive a sports car just to prove
I'm a real big baller 'cause I made a million dollars
And I spend it on girls and shoes
But you don't wanna be high like me
Never really knowing why like me
You don't ever wanna step off that roller coaster
And be all alone
You don't wanna ride the bus like this
Never knowing who to trust like this
You don't wanna be stuck up on that stage singing
Stuck up on that stage singing
All I know are sad songs, sad songs
Darling, all I know are sad songs, sad songs
I'm just a singer who already blew his shot
I get along with old timers
'Cause my name's a reminder of a pop song people forgot
And I can't keep a girl, no
'Cause as soon as the sun comes up
I cut 'em all loose and work's my excuse
But the truth is I can't open up
Now you don't wanna be high like me
Never really knowing why like me
You don't ever wanna step off that roller coaster
And be all alone
You don't wanna ride the bus like this
Never knowing who to trust like this
You don't wanna be stuck up on that stage singing
Stuck up on that stage singing
All I know are sad songs, sad songs
Darling, all I know are sad songs, sad songs`
    },
    "Selena Gomez — Love You Like a Love Song": {
        duration: 188, // 3:08
        text: `It's been said and done
Every beautiful thought's been already sung
And I guess right now, here's another one
So your melody will play on and on, with the best of 'em
You are beautiful, like a dream come alive, incredible
A centerfold miracle, lyrical
You saved my life again
And I want you to know, baby
I, I love you like a love song, baby
I, I love you like a love song, baby
I, I love you like a love song, baby
And I keep hitting repeat-peat-peat-peat-peat-peat
Constantly, boy, you play through my mind like a symphony
There's no way to describe what you do to me
You just do to me what you do
And it feels like I've been rescued, I've been set free
I am hypnotized by your destiny
You are magical, lyrical, beautiful, you are
And I want you to know, baby
I, I love you like a love song, baby
I, I love you like a love song, baby
I, I love you like a love song, baby
And I keep hitting repeat-peat-peat-peat-peat-peat
No one compares
You stand alone to every record I own
Music to my heart, that's what you are
A song that goes on and on
I, I love you like a love song, baby
I, I love you like a love song, baby
I, I love you like a love song, baby
And I keep hitting repeat-peat-peat-peat-peat-peat`
    },
    "Benson Boone — In the Stars": {
        duration: 210, // ~3:30 estimated
        text: `Sunday mornings were your favorite
I used to meet you down on Woods Creek Road
You did your hair up like you were famous
Even though it's only church where we were goin'
Now Sunday mornings, I just sleep in
It's like I've buried my faith with you
I'm screamin' at a God, I don't know if I believe in
'Cause I don't know what else I can do
I'm still holdin' on to everything that's dead and gone
I don't wanna say goodbye 'cause this one means forever
Now you're in the stars and six feet's never felt so far
Here I am alone between the heavens and the embers
Oh, it hurts so hard for a million different reasons
You took the best of my heart and left the rest in pieces
Diggin' through your old birthday letters
A crumpled twenty still in the box
I don't think that I could ever find a way to spend it
Even if it's the last twenty that I've got
Oh, I'm still holdin' on to everything that's dead and gone
I don't wanna say goodbye 'cause this one means forever
Now you're in the stars and six feet's never felt so far
Here I am alone between the heavens and the embers
Oh, it hurts so hard for a million different reasons
You took the best of my heart and left the rest in pieces
I'm still holdin' (on), holdin' (on), holdin' on
I'm still holdin' (on), holdin' (on), holdin' on
I'm still holdin' (on), holdin' (on), I'm still holdin' on
I'm still, ooh, still holdin' on`
    },
    "David Guetta — I'm Good (Blue)": {
        duration: 175, // 2:55
        text: `I'm good, yeah, I'm feelin' alright
Baby, I'ma have the best fuckin' night of my life
And wherever it takes me, I'm down for the ride
Baby, don't you know I'm good?
Yeah, I'm feelin' alright
'Cause I'm good, yeah, I'm feelin' alright
Baby, I'ma have the best fuckin' night of my life
And wherever it takes me, I'm down for the ride
Baby, don't you know I'm good?
Yeah, I'm feelin' alright
Don't you know I'm good?
Yeah, I'm feelin' alright
You know I'm down for whatever tonight
I don't need the finer things in life
No matter where I go, it's a good time
And I, I don't need to sit in VIP
Middle of the floor, that's where I'll be
Don't got a lot, but that's enough for me, yeah
'Cause I'm good, yeah, I'm feelin' alright
Baby, I'ma have the best fuckin' night of my life
And wherever it takes me, I'm down for the ride
Baby, don't you know I'm good?
Yeah, I'm feelin' alright
So I just let it go, let it go, oh-na-na-na
No, I don't care no more, care no more, oh-na-na-na
So come on, let me know, let me know, put your hands up, na-na-na
No, baby, nothin's gonna stop us tonight`
    },
    "Harry Styles — As It Was": {
        duration: 167, // 2:47
        text: `Holdin' me back
Gravity's holdin' me back
I want you to hold out the palm of your hand
Why don't we leave it at that?
Nothin' to say
When everything gets in the way
Seems you cannot be replaced
And I'm the one who will stay, oh-oh-oh
In this world, it's just us
You know it's not the same as it was
In this world, it's just us
You know it's not the same as it was
As it was, as it was
You know it's not the same
Answer the phone
"Harry, you're no good alone
Why are you sitting at home on the floor?
What kind of pills are you on?"
Ringin' the bell
And nobody's coming to help
Your daddy lives by himself
He just wants to know that you're well, oh-oh-oh
In this world, it's just us
You know it's not the same as it was
In this world, it's just us
You know it's not the same as it was
As it was, as it was
You know it's not the same
Go home, get ahead, light-speed internet
I don't wanna talk about the way that it was
Leave America, two kids follow her
I don't wanna talk about who's doin' it first
(Hey) As it was
You know it's not the same as it was
As it was, as it was`
    }
};

for (const [title, data] of Object.entries(BATCH_5)) {
    const json = interpolateLyrics(title, data.text, data.duration);
    if (json.length > 0) {
        fs.writeFileSync(path.join(outputDir, `${title}.json`), JSON.stringify(json, null, 4));
        console.log(`Updated ${title} (Interpolated ${json.length} lines)`);
    } else {
        console.warn(`Failed to interpolate for ${title}`);
    }
}
