---
layout: post
title:  "Swift Optional Boolean"
date:   2023-09-19 13:02:05 +0300
categories: swift development
---
I finally found a use for an optional boolean in swift....

Well I say a use, this is for a button that doesn't work first time. Like if you where creating an annoying popup advert this first time you hit mute or dismiss nothing happens. The user will think it's his fat finger and you get an extra half a second of eyeball on the screen before the user hits it again. Really annoying....


{% highlight swift %}
import SwiftUI

struct ContentView: View {
    @State var isPlaying : Bool?
    var body: some View {
        VStack {
            Button {
                if let playing = isPlaying {
                    isPlaying?.toggle()
                } else {
                    isPlaying = false
                }
                print("Button was tapped")
            } label: {
                if let playing = isPlaying {
                    Image(systemName: self.isPlaying == true ? "speaker.fill" : "speaker.slash").imageScale(.large)
                } else {
                    Image(systemName: "speaker.slash").imageScale(.large)
                }
            }
        }
        .padding()
    }
}

struct ContentView_Previews: PreviewProvider {
    static var previews: some View {
        ContentView()
    }
}
{% endhighlight %}


[jekyll-docs]: https://jekyllrb.com/docs/home
[jekyll-gh]:   https://github.com/jekyll/jekyll
[jekyll-talk]: https://talk.jekyllrb.com/
