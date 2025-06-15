package me.kimbomin.board.controller;

import lombok.RequiredArgsConstructor;
import me.kimbomin.board.dto.BoardResDto;
import me.kimbomin.board.service.BoardService;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/board")
@RequiredArgsConstructor
public class BoardController {
    private final BoardService boardService;

    @GetMapping
    public ResponseEntity<List<BoardResDto>> getBoard(
            @RequestParam(defaultValue = "paging") String strategy,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) Long cursorId
    ){
        // 페이징 전략의 경우, 최신글부터 보여주기 위해 id 내림차순 정렬 적용
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "id"));

        List<BoardResDto> posts = boardService.getPosts(strategy, pageable, cursorId);

        return ResponseEntity.ok(posts);
    }
}
