loadComments = (id) => {
    console.log("none");
}

$("#submit").on("click", () =>{
    event.preventDefault();

    $.ajax({
        type: "POST",
        url: "/submit",
        dataType: "json",
        data: {
            commentText: $("#comment").val(),
            id: $("#submit").attr("data-id")
        }
    }).then((data) =>{
        loadComments($("#submit").attr("data-id"));
    })
})

$(".delete").on("click", () =>{
    event.preventDefault();
    console.log("in here");
    $.ajax({
        type: "POST",
        url: "/delete",
        dataType: "json",
        data: {id: $(this).attr("data-id"),
        comment: $(this).attr("data-comment")
    }
    }).then(() =>{
        loadComments($("#submit").attr("data-id"))
    })
})