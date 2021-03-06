import axios from "axios"
import { useState } from "react"
import { useEffect } from "react"
import { useRef, memo } from "react"
import { useContext } from "react"
import { MyContext } from "../context-provider/MyContext"
// import { nanoid } from "nanoid"
import CircularProgress from '@mui/material/CircularProgress'
import { LikeComment } from "../../docs/f/interact_comment/like_comment"
import { useMutation } from "@apollo/client"
import { LikeCommentGraph } from "../../graphql/like_comment"
import { UndoLikeComment } from "../../graphql/undoLikeComment"
import moment from "moment"
import { loadmorecomment } from "../../api/load_more_comment"
import { count_feedback_comment, load_feedback_comment } from "../../api/load_feedback_comment"



export const sleep = ms => new Promise(r => setTimeout(r, ms));
const FrameComment= (props)=> {
    
    return (
        <div className="framecomment">
            <Wrapper number_of_comment={props.number_of_comment} id_comment={props.id_comment} data={props.data} />
        </div>
    )
}

export default memo(FrameComment)

const Wrapper= (props)=> {
    return (
        <div className="comment">
            <Section1 number_of_comment={props.number_of_comment} />
            <Section2 className="section2" />
            <Section3 id_comment={props.id_comment} data={props.data} />
        </div>
    )
}

const Section1= (props)=> {
    return (
        <div className="section1">
            <Wrapper1 number_of_comment={props.number_of_comment} />
            <Wrapper2 />
        </div>
    )
}
const CountComment= (props)=> {
    return (
        <div className="count-comment">
            {
                props.number_of_comment
            }
        </div>
    )
    
}
const Wrapper1= (props)=> {
    return (
        <div className="wrapper1">
            <Title /> 
            <CountComment number_of_comment={props.number_of_comment} />
        </div>
    )
}
const Title= ()=> {
    return (
        <div className="title">
            Comments
        </div>
    )
}
const Wrapper2= ()=> {
    const { CloseCommentFunctionD }= useContext(MyContext)
    return (
        <div className="wrapper2">
            <FilterComment />
            <CloseComment f={CloseCommentFunctionD} /> 
        </div>
    )
}
const FilterComment= ()=> {
    return (
        <div className="filter-comment">
            <svg viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" focusable="false" className="style-scope yt-icon" style={{pointerEvents: "none", display: "block", width: "100%", height: "100%"}}><g className="style-scope yt-icon"><path d="M21,6H3V5h18V6z M15,11H3v1h12V11z M9,17H3v1h6V17z" className="style-scope yt-icon"></path></g></svg>
        </div>
    )
}

const CloseComment= (props)=> {
    return (
        <div className="close-comment" onClick={()=> props.f()}>
            <svg viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" focusable="false" className="style-scope yt-icon" style={{pointerEvents: "none", display: "block", width: "100%", height: "100%"}}><g className="style-scope yt-icon"><path d="M12.7,12l6.6,6.6l-0.7,0.7L12,12.7l-6.6,6.6l-0.7-0.7l6.6-6.6L4.6,5.4l0.7-0.7l6.6,6.6l6.6-6.6l0.7,0.7L12.7,12z" className="style-scope yt-icon"></path></g></svg>
        </div>
    )
}

const Section2= (props)=> {
    return (
        <div className={props.className}>
            <CommentAction className="comment-action" />
        </div>
    )
}

const CommentAction= (props)=> {
    return (
        <div className={props.className}>
            <CommentActionAvatar className="comment-action-avatar" />
            <CommentActionInput className="wrapper-action-input" className1="comment-action-input" />
        </div>
    )
}
const CommentActionAvatar= memo((props)=> {
    const { photoUrl }= useContext(MyContext)
    return (
        <div className={props.className}>
            <img src={photoUrl} alt="open" referrerPolicy="no-referrer" />
        </div>
    )
})
const CommentActionInput= memo((props)=> {
    const { setComment, comment }= useContext(MyContext)
    return (
        <div className={props.className}>
            <div className={props.className1}>
                <input type="text" value={comment} placeholder="Public comment..." onChange={(e)=> setComment(e)} />
            </div>
            {
                comment.length>0 &&
                <SendComment />
            }
        </div>
    )
})

const SendComment= memo(()=> {
    const ref1= useRef(null)
    const ref2= useRef(null)
    const { commentEmpty,ResetComment }= useContext(MyContext)
    return (
        <div className="send-comment">
            <ButtonSendComment customRef={ref1} title="Submit" disabled={!commentEmpty} color={commentEmpty=== false ? '#aaaaaa' : '#fff' } backgroundColor={commentEmpty=== false ? 'rgba(255, 255, 255, 0.1)' : "#2e89ff"} />
            <ButtonSendComment customRef={ref2} title="Cancel" disabled={false} f={ResetComment} />
        </div>
    )
})
const ButtonSendComment= memo((props)=> {
    return (
        <button disabled={props.disabled} ref={props.customRef} className="button-send-comment" onClick={()=> props.f()} style={{color: props.color, backgroundColor: props.backgroundColor}}>
            {props.title}
        </button>
    )
})

// 
const Section3= (props)=> {
    const [state, setState]= useState(()=> ({
        data: [],
        loading: true,
        loadingMore: true,
        minItem: 0,
        id: 0
    }))

    const [duplicate, setDuplicate]= useState(()=> ({
        id: 99999999999,
        minvalue: 999999999,
    }))
    const [dataMore, setDataMore]= useState(()=> [])
    useEffect(()=> {
        (async()=> {
            try {
                const res= await axios("http://localhost:4000/comment/", {
                    params: { id_comment: props.id_comment }
                })
                const result= await res.data
                await sleep(1500)
                setState((prev)=> ({...prev, data: result, loading: false, minItem: Math.min(...result.map(item=> item.like_)), id: result.find(item=> item.like_ === Math.min(...result.map(item=> item.like_))).id}))
        
            }catch(error) {
                console.log(error)
            }
        })()
    }, [props.id_comment])

    const a= (e)=> {
        if(Math.ceil(e.target.scrollHeight - e.target.scrollTop) === e.target.clientHeight) {
            loadmorecomment(props.id_comment, state.minItem, setDataMore, dataMore, setState, state.id, setDuplicate, duplicate.id, duplicate.minvalue)
        }   
    }
    if(state.loading=== true) {
        return (
            <div className="loading" style={{width: '100%', marginLeft: 'auto', marginRight: 'auto', display: 'flex', justifyContent: 'center',alignItems: 'center'}}><CircularProgress color="secondary" /></div>
        )    
    }
    else {
        return (
            <div className="section3" onScroll={(e)=> a(e)}>
                {
                    state.data.map((item, key)=> <ItemSection3 key={key} {...item} data={props.data} comment={props.id_comment} />)
                }
                {
                    state.loadingMore=== true ?<div className="loading" style={{width: '100%', marginLeft: 'auto', marginRight: 'auto', display: 'flex', justifyContent: 'center',alignItems: 'center'}}><CircularProgress color="secondary" /></div>
                     : dataMore.map((item, key)=> <ItemSection3 key={key} {...item} data={props.data} comment={props.id_comment} />)
                }
            </div>
        )
    }
    
}

const ItemSection3= memo((props)=> {
    const [count, setCount]= useState(()=> 0)

    useEffect(()=> {
        count_feedback_comment("hrewesfdghvsdawsds") // props.id_comment
        .then(res=> setCount(()=> res))
        .catch(err=> console.error(err))
    }, [props.id_comment])

    return (
        <div className="item-section3">
            <AvatarComment avatar={props.avatar_comment}  />
            <Container {...props} data={props.data} count_comment={count} />
        </div>

    )
})
//

const AvatarComment= (props)=> {
    return (
        <div className="avatar-comment">
            <AvatarCommentImage avatar={props.avatar} /> 
        </div>
    )
}
const AvatarCommentImage= (props)=> {
    return (
        <div className="img-avatar">
            <img src={props.avatar} alt="open" referrerPolicy="no-referrer" />
        </div>
    )
}

//
const WrapperNameandTimestamp= (props)=> {
    return (
        <div className="wrapper-name-and-timestamp"> 
            <NameComment name_comment={props.name_comment} />
            <TimeStamp timestamp={props.timestamp} />
            <Edited edited={props.edited} />
        </div>
    )
}
const NameComment= (props)=> {
    return (
        <div className="name-comment">
            {props.name_comment}
        </div>
    )
}
const TimeStamp= (props)=> {
    
    // console.log(moment().format("YYYY-MM-DD hh:mm:ss a"))
    return (
        <div className="timestamp">
            &nbsp;{moment(`${props.timestamp}`, 'YYYY-MM-DD hh:mm:ss a').fromNow()}
        </div>
    )
}
const Edited= (props)=> {
    return (
        <div className="edited">
            &nbsp;( edited )
        </div>
    )
}
// 


const Container= (props)=> {
    const [state, setState]= useState(()=> ({
        data: [],
        loading: false,
        minValue: 100000000,
        id: 99999999,
        click: false
    }))
    const clickMore= ()=> {
        setState(prev=> ({...prev, click: !state.click}))
    }
    return (
        <div className="container">
            <WrapperNameandTimestamp name_comment={props.name_comment} timestamp={props.timestamp} edited={props.edited} />
            <Content content={props.content} />
            <WrapperLikeandDislike like={props.like_} id_comment={props.id_comment} data={props.data} comment={props.comment} />
            {
               ( props.count_comment!==0 || props.count_comment!== null ) && 
               (
                    state.click=== false ?
                   <SeeMore clickMore={clickMore} id_comment={props.id_comment} count_comment={props.count_comment} {...state} setState={setState} /> : <Collapse clickMore={clickMore} count_comment={props.count_comment} setState={setState} />
               )
            }
            
            {
                state.click=== true &&
                
                (
                    state.data.map((item, key)=> <PerLoadMore key={key} avatar={item.avatar_comment} data={props.data} comment={props.id_comment}
                name_comment={item.name_comment} timestamp={item.timestamp} edited={item.edited} content={item.content} like_={item.like_} id_comment={item.id_comment} />)

            )
                
            }
            {
                state.click=== true &&
                (
                    state.loading=== true ? <div className="loading" style={{width: '100%', marginLeft: 'auto', marginRight: 'auto', display: 'flex', justifyContent: 'center',alignItems: 'center', marginTop: 10, marginBottom: 10}}><CircularProgress color="secondary" /></div> :
                    <ClickMore id_comment={props.id_comment} count_comment={props.count_comment} {...state} setState={setState}  />
                )
            }
        </div>
    )
}
const SeeMore= (props)=> {

    const b= async ()=> {
        props.clickMore()
        await load_feedback_comment(props.id_comment, props.minValue, props.id, props.setState )
        .then(res=> props.setState(prev=> ({...prev, data: props.data.concat(res)})))
        .catch(err=> console.error(err))
    }
    return (
        <div onClick={()=> b()} className="count-comment" style={{width: '100%', textTransform: 'uppercase', color: "#2e89ff", fontWeight: 600, cursor: 'pointer'}}>
                   
            See more {(props.count_comment)} answer{props.count_comment > 1 && 's'}
        </div>
    )
}
const ClickMore= (props)=> {
    const b= async ()=> {
        await load_feedback_comment(props.id_comment, props.minValue, props.id, props.setState )
        .then(res=> props.setState(prev=> ({...prev, data: props.data.concat(res)})))
        .catch(err=> console.error(err))
    }
    return (
        <div onClick={()=> b()} className="click-more" style={{color: '#2e89ff', width: '100%', margin: '8px 0', cursor: 'pointer'}}>
            See more
        </div>
    )
}
const Collapse= memo((props)=> {
    const c= ()=> {
        props.setState(prev=> ({...prev, data: [], minValue: 100000000, id: 99999999 }))
    }
    return (
        <div onClick={()=> {props.clickMore();c()}} className="collapse-comment" style={{width: '100%', textTransform: 'uppercase', color: "#2e89ff", fontWeight: 600, cursor: 'pointer'}}>
            Collapse {props.count_comment} answer{props.count_comment > 1 && "s"}
        </div>
    )
})
const PerLoadMore= (props)=> {
    return (
        <div className="container-per-load-more">
            <AvatarComment avatar={props.avatar} />
            <div style={{width: '100%'}}>
                <WrapperNameandTimestamp name_comment={props.name_comment} timestamp={props.timestamp} edited={props.edited} />
                <Content content={props.content} />
                <WrapperLikeandDislike like={props.like_} id_comment={props.id_comment} data={props.data} comment={props.comment} />
            </div>
        </div>
    )
}

const Content= (props)=> {
    return (
        <div className="content">
            {props.content}
        </div>
    )
}
const WrapperLikeandDislike= (props)=> {
    const [turnFeedback, setTurnFeedBack]= useState(()=> false)
    return (
        <div className="wrapper-1">
            <div className="wrapper-like-and-dislike">
                <CountLike like={props.like} id_comment={props.id_comment} data={props.data} comment={props.comment} />
                <CountDislike />
                <Feedback name_comment={props.name_comment} setTurnFeedBack={setTurnFeedBack} />
            </div>

            {
                turnFeedback=== true &&
                <Section2 className="section2-sub" />
            }
        </div>
    )
}


const CountLike= (props)=> {
    const [state, setState]= useState(()=> ({
        like: props.like,
        toggle: true
    }))
    const { tokenId }= useContext(MyContext)

    const [LikeCommentAction]= useMutation(LikeCommentGraph)
    const [UndoLikeCommentAction]= useMutation(UndoLikeComment)
    useEffect(()=> {
        if((props.data.user.comment_liked.split(",").includes(props.id_comment))=== true) {
            setState(prev=> ({...prev, toggle: true}))
        }
        else { 
            setState(prev=> ({...prev, toggle: false}))
        }
    }, [props.data.user.comment_liked, props.id_comment])
    return (
        <div className="count-like">
            <button className="btn-count-like" onClick={()=> LikeComment(setState, state.like, state.toggle, LikeCommentAction, tokenId, props.id_comment, UndoLikeCommentAction, props.comment)}>
                {
                    (((props.data.user.comment_liked.split(",").includes(props.id_comment))=== true && state.toggle=== true) || state.toggle=== true) ?

                    <LikedIconComment /> : 

                <LikeIconComment />

            }
            </button>
            <NumberOfLike like={state.like} />
        </div>
    )
}
const NumberOfLike= memo((props)=> {
    return (
        <div className="number-of-like">
            {props.like}
        </div>
    )
})
const NumberOfDislike= ()=> {
    return (
        <div className="number-of-dislike">
            
        </div>
    )
}
const CountDislike= ()=> {
    return (
        <div className="count-dislike">
            <button className="btn-count-dislike">
                <DislikeIconComment />
            </button>
            <NumberOfDislike />
        </div>

    )
}
const Feedback= (props)=> {
    return (
        <div onClick={()=> props.setTurnFeedBack((prev)=> !prev)} className="feedback" style={{cursor: 'pointer', userSelect: 'none'}}>
            Reply
        </div>
    )
}

const LikeIconComment= ()=> (
    <svg viewBox="0 0 16 16" preserveAspectRatio="xMidYMid meet" focusable="false" className="style-scope yt-icon" style={{pointerEvents: "none", display: "block", width: "100%", height: "100%"}}><g className="style-scope yt-icon"><path d="M12.42,14A1.54,1.54,0,0,0,14,12.87l1-4.24C15.12,7.76,15,7,14,7H10l1.48-3.54A1.17,1.17,0,0,0,10.24,2a1.49,1.49,0,0,0-1.08.46L5,7H1v7ZM9.89,3.14A.48.48,0,0,1,10.24,3a.29.29,0,0,1,.23.09S9,6.61,9,6.61L8.46,8H14c0,.08-1,4.65-1,4.65a.58.58,0,0,1-.58.35H6V7.39ZM2,8H5v5H2Z" className="style-scope yt-icon"></path></g></svg>
)
const LikedIconComment= memo(()=> (
    <svg viewBox="0 0 16 16" preserveAspectRatio="xMidYMid meet" focusable="false" className="style-scope yt-icon" style={{pointerEvents: "none", display: "block", width: "100%", height: "100%"}}><g className="style-scope yt-icon"><path d="M12.42,14A1.54,1.54,0,0,0,14,12.87l1-4.24C15.12,7.76,15,7,14,7H10l1.48-3.54A1.17,1.17,0,0,0,10.24,2a1.49,1.49,0,0,0-1.08.46L5,7l0,7ZM4,14H1V7H4Z" className="style-scope yt-icon"></path></g></svg>
))
// const DislikedIconComment= ()=> (
//     <svg viewBox="0 0 16 16" preserveAspectRatio="xMidYMid meet" focusable="false" className="style-scope yt-icon" style={{pointerEvents: "none", display: "block", width: "100%", height: "100%"}}><g className="style-scope yt-icon"><path d="M3.54,2A1.55,1.55,0,0,0,2,3.13L1,7.37C.83,8.24,1,9,2,9H6L4.52,12.54A1.17,1.17,0,0,0,5.71,14a1.49,1.49,0,0,0,1.09-.46L11,9l0-7ZM12,2h3V9H12Z" className="style-scope yt-icon"></path></g></svg>
// )
const DislikeIconComment= ()=> (
    <svg viewBox="0 0 16 16" preserveAspectRatio="xMidYMid meet" focusable="false" className="style-scope yt-icon" style={{pointerEvents: "none", display: "block", width: "100%", height: "100%"}}><g className="style-scope yt-icon"><path d="M3.54,2A1.55,1.55,0,0,0,2,3.13L1,7.37C.83,8.24,1,9,2,9H6L4.52,12.54A1.17,1.17,0,0,0,5.71,14a1.49,1.49,0,0,0,1.09-.46L11,9h4V2ZM6.07,12.86a.51.51,0,0,1-.36.14.28.28,0,0,1-.22-.09l0-.05L6.92,9.39,7.5,8H2a1.5,1.5,0,0,1,0-.41L3,3.35A.58.58,0,0,1,3.54,3H10V8.61ZM14,8H11l0-5h3Z" className="style-scope yt-icon"></path></g></svg>
)