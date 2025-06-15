package me.kimbomin.board.dto;

import lombok.Getter;
import me.kimbomin.board.domain.Board;

import java.time.LocalDateTime;

@Getter
public class BoardResDto {
    private final Long id;
    private final String title;
    private final String content;
    private final String author;
    private final LocalDateTime createdAt;

    private BoardResDto(Board board){
        this.id = board.getId();
        this.title = board.getTitle();
        this.content = board.getContent();
        this.author = board.getAuthor();
        this.createdAt = board.getCreatedAt();
    }

    public static BoardResDto from(Board board){
        return new BoardResDto(board);
    }
}
