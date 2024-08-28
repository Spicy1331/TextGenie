export default [
    {
      name:'Blog Title',
      desc:'An AI tool that generate blog title depends on your blog information',
      category:'Blog',
      icon:'https://cdn-icons-png.flaticon.com/128/2799/2799991.png',
      aiPrompt:'Give me 5 blog topic idea in bullet wise only based on given niche & outline and give me result in Rich text editor format',
      slug:'generate-blog-title',
      form:[
        {
            label:'Enter your blog niche',
            field:'input',
            name:'niche',
            required:true
        },
        {
            label:'Enter blog outline',
            field:'textarea',
            name:'outline',
        }
      ]
    },
    {
        name:'Blog Content',
        desc:'An AI tool that serves as your personal blog post title based on topic and outline provided',
        category:'blog',
        icon:'https://cdn-icons-png.flaticon.com/128/10026/10026257.png',
        slug:'blog-content-generation',
        aiPrompt:'Generate Blog Content based on topic and outline provided',
        for:[
            {
                label:'Enter your blog topic',
                field:'input',
                name:'topic',
                required:true,
            },
            {
                label:'Enter blog Outline here',
                field:'textarea',
                name:'outline'
            }
        ]
    },
    {
        name:'Blog Topic Ideas',
        desc:'An AI tool that serves as your personal blog post title based on your niche',
        category:'Blog',
        icon:'https://cdn-icons-png.flaticon.com/128/3959/3959542.png',
        slug:'blog-topic-idea',
        aiPrompt:'Generate top 5 Blog Topic Ideas in bullet point based on the given niche',
        form:[
            {
                label:'Enter your Niche',
                field:'input',
                name:'niche',
                required:true
            },
        ]
    },
     {
        name:'Youtube SEO Title',
        desc:'An AI tool that serves as your personal blog post title for your YouTube videos',
        category:'Youtube Tools',
         icon:'https://cdn-icons-png.flaticon.com/128/1300/1300518.png',
         slug:'youtube-seo-title',
         aiPrompt:'Give me best SEO optimized high ranked 5 title ideas based on the provided keywords and outline',
        form:[
            {
                 label:'Enter your youtube video topic keywords',
                 field:'input',
                 name:'keywords',
                 required:true
            },
             {
                 label:'Enter youtube description Outline here',
                 field:'textarea',
                 name:'outline'  
             }
                ]
            },
            {
            name:'Youtube Description',
            desc:'An AI tool that serves as your personal blog post descriptions for your YouTube videos',
            category:'Youtube Tool',
            icon:'https://cdn-icons-png.flaticon.com/128/10885/10885014.png',
            slug:'youtube-description',
            aiPrompt:'Generate a Youtube description with emojis under 4-5 lines based on the provided topic/title and outline',
            form:[
                {
                label:'Enter your blog topic/title',
                field:'input',
                name:'topic',
                required:true
                },
                {
                    label:'Enter youtube Outline here',
                    field:'textarea',
                    name:'outline'
                }
            ]
            },
            {
                name:'Youtube Tags',
                desc:'An AI tool that generates tags for your YouTube videos',
                category:'YouTube Tool',
                icon:'https://cdn-icons-png.flaticon.com/128/10884/10884882.png',
                slug:'youtube-tag',
                aiPrompt:'Generate 10 Youtube tags in bullet point based on the provided title and outline',
                form:[
                    {
                        label:'Enter your youtube title',
                        field:'input',
                        name:'title',
                        required:true
                    },
                    {
                        label:'Enter youtube video Outline here (Optional)',
                        field:'textarea',
                        name:'Outline'
                    }
                ]
            },
            {
                name:'Rewrite Article (Plagiarism Free)',
                desc:'Use this tool to rewrite existing Article or Blog Post without plagiarism',
                icon:'https://cdn-icons-png.flaticon.com/128/2992/2992156.png',
                category:'Rewriting Tool',
                slug:'rewrite-article',
                aiPrompt:'Rewrite give article without any Plagiarism in a rich-content format',
                form:[
                    {
                        label:'Provide your Article/Blogpost or any other content',
                        field:'textarea',
                        name:'article',
                        required:true
                    }
                ]
            },
            {
                name:'Add Emojis to Text',
                desc:'An AI tool that adds emojis to your text',
                icon:'https://cdn-icons-png.flaticon.com/128/2776/2776405.png',
                category:'blog',
                slug:'add-emoji-to-text',
                aiPrompt:'Add Emoji to outline text depends on outline and titles',
                form:[
                    {
                        label:'Enter your text to add emojis',
                        field:'textarea',
                        name:'outline',
                        required:true
                    }
                ]
            },
            {
                name:'Instagram Post Generator',
                desc:'An AI tool that generates Instagram posts based on provided keywords',
                icon:'https://cdn-icons-png.flaticon.com/128/15047/15047534.png',
                category:'blog',
                slug:'instagram-post-generator',
                aiPrompt:'Generate 3 Instagram post depends on a given keywords',
                form:[
                    {
                        label:'Enter Keywords for your post',
                        field:'input',
                        name:'keywords',
                        required:true
                    },
                ]
            },
        ]
 
