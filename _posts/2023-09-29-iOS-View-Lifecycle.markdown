---
layout: post
title:  "UIKit View Lifecycle"
date:   2023-09-29 13:00:05 +0300
categories: swift development
---
The lifecycle of a UIView

#viewDidLoad

{% highlight swift %}
    override func viewDidLoad() {
        super.viewDidLoad()
}
{% endhighlight %}

#viewDidLayoutSubviews

{% highlight swift %}
    override func viewDidLayoutSubviews() {
        super.viewDidLayoutSubviews()

}
{% endhighlight %}

#viewWillAppear

{% highlight swift %}
    override func viewWillAppear(_ animated: Bool) {
        super.viewWillAppear(animated)

}
{% endhighlight %}

#viewDidAppear

{% highlight swift %}
    override func viewDidAppear(_ animated: Bool) {
        super.viewDidAppear(animated)

}
{% endhighlight %}

#viewWillDisappear

{% highlight swift %}
    override func viewWillDisappear(_ animated: Bool) {
        super.viewWillDisappear(animated)

}
{% endhighlight %}

#viewDidDisappear

{% highlight swift %}
    override func viewDidDisappear(_ animated: Bool) {
        super.viewDidDisappear(animated)

}
{% endhighlight %}

#deinit

{% highlight swift %}
    override func deinit() {
        super.deinit()

}
{% endhighlight %}


[jekyll-docs]: https://jekyllrb.com/docs/home
[jekyll-gh]:   https://github.com/jekyll/jekyll
[jekyll-talk]: https://talk.jekyllrb.com/
